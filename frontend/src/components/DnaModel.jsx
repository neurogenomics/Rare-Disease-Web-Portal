/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.4.1 scene.gltf --transform 
Files: scene.gltf [14.16KB] > /Users/zhangyichun/Documents/Imperial/MSc Individual Project/rare-disease-web-portal/frontend/public/models/dna3/scene-transformed.glb [987.7KB] (-6875%)
Author: arlindo.matheus (https://sketchfab.com/arlindo.matheus)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/dna-45f0707098b140468d993d54a258d5f3
Title: DNA
*/

import React from "react";
import { useGLTF } from "@react-three/drei";

export function DnaModel(props) {
    const { nodes, materials } = useGLTF(
        "/models/dna1/scene-transformed.glb"
    );
    return (
        <group {...props} dispose={null}>
            <mesh
                geometry={nodes.Object_4.geometry}
                material={materials.Material}
                position={[10, -5, 10]}
                rotation={[0, 0, -0.5]}
                material-color="#8b5cf6"
            />
        </group>
    );
}

useGLTF.preload("/models/dna1/scene-transformed.glb");
