import { Color } from "three";
import { UniformsLib } from "three/src/renderers/shaders/UniformsLib.js";
import { UniformsUtils } from "three/src/renderers/shaders/UniformsUtils.js";

const glsl = (x: any) => x.join("");

var CustomMeshPhysicalShader = {
  uniforms: UniformsUtils.merge([
    UniformsLib.common,
    UniformsLib.envmap,
    UniformsLib.normalmap,
    UniformsLib.roughnessmap,
    UniformsLib.metalnessmap,
    UniformsLib.lights,
    {
      map: { value: null },
      emissive: { value: new Color(0x000000) },
      roughness: { value: 0.5 },
      metalness: { value: 0.5 },
      envMapIntensity: { value: 1 },
      mouse: { value: 1 },
    },
  ]),

  vertexShader: glsl`
	#define PHYSICAL

	attribute float instanceRandom;
	attribute float instanceScale;
	
	varying float vScale;
	varying vec3 vViewPosition;
	varying vec3 vPosition;
	
	#ifndef FLAT_SHADED
	
		varying vec3 vNormal;
	
		#ifdef USE_TANGENT
	
			varying vec3 vTangent;
			varying vec3 vBitangent;
	
		#endif
	
	#endif
	
	#include <common>
	#include <uv_pars_vertex>
	#include <color_pars_vertex>
	#include <shadowmap_pars_vertex>
	
	vec3 applyQuaternionToVector( vec4 q, vec3 v ){
		return v + 2.0 * cross( q.xyz, cross( q.xyz, v ) + q.w * v );
	}

	void main() {

		vScale = instanceScale;
	
		#include <uv_vertex>
		#include <color_vertex>
	
		#include <beginnormal_vertex>
		#include <defaultnormal_vertex>
	
		#ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED
		
			vNormal = normalize( transformedNormal );
		
			#ifdef USE_TANGENT
		
				vTangent = normalize( transformedTangent );
				vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		
			#endif
		
		#endif
	
		#include <begin_vertex>
		#include <project_vertex>

		vViewPosition = -mvPosition.xyz;
		vPosition = position;

		#include <worldpos_vertex>
		#include <shadowmap_vertex>
	
	}
	`,

  fragmentShader: glsl`
	#define USE_UV
	#define USE_NORMALMAP
	#define TONE_MAPPING
	#define PHYSICAL

	varying float vScale;
	
	uniform vec3 diffuse;
	uniform vec3 emissive;
	uniform float roughness;
	uniform float metalness;
	uniform float opacity;
	uniform float uTime;
	uniform float uRandom;
	uniform float uScale;
	uniform vec3 scale;
	uniform float mouse;
	
	#ifdef USE_SHEEN
		uniform vec3 sheen;
	#endif
	
	varying vec3 vViewPosition;
	varying vec3 vPosition;
	
	#ifndef FLAT_SHADED
	
		varying vec3 vNormal;
	
		#ifdef USE_TANGENT
	
			varying vec3 vTangent;
			varying vec3 vBitangent;
	
		#endif
	
	#endif
	
	#include <common>
	#include <packing>
	#include <color_pars_fragment>
	#include <uv_pars_fragment>
	#include <map_pars_fragment>
	#include <bsdfs>
	#include <cube_uv_reflection_fragment>
	#include <envmap_common_pars_fragment>
	#include <envmap_physical_pars_fragment>
	#include <lights_pars_begin>
	#include <lights_physical_pars_fragment>
	#include <shadowmap_pars_fragment>
	#include <normalmap_pars_fragment>
	#include <roughnessmap_pars_fragment>
	#include <metalnessmap_pars_fragment>

	float map(float value, float min1, float max1, float min2, float max2) {
		return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
	}

	void main() {
		float smoothScale = pow(vScale, .5);
		smoothScale = clamp(1.-smoothScale,0.,1.);
		vec3 c = 0.5 + 0.5 * cos(smoothScale * 5. + vPosition.xyz * 0.65 + vec3(0., 2., 4.)); // from starting shadertoy
		c = mix(c, vec3(0.), smoothScale);
		float depthFactor = smoothstep(-1., 1., cameraPosition.z-vViewPosition.z); // camera-based depth
		c = mix(c * .2,c, depthFactor); // apply depth factor to color
		float alpha = clamp(mix(0.,6., depthFactor), 0.25, 1.);
		vec4 diffuseColor = vec4( clamp(c, 0., 1.), alpha );
		ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
		vec3 totalEmissiveRadiance = emissive + c * clamp(vScale, .35, 1.);
	
		#include <roughnessmap_fragment>
		#include <metalnessmap_fragment>
		#include <normal_fragment_begin>
		#include <normal_fragment_maps>
	
		// accumulation
		#include <lights_physical_fragment>
		#include <lights_fragment_begin>
		#include <lights_fragment_maps>
		#include <lights_fragment_end>
	
		// modulation
		vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	
		gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	
		#include <tonemapping_fragment>
	
	}
	`,
};

export { CustomMeshPhysicalShader };
