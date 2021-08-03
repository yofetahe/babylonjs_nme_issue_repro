import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";

import * as TEST from '@babylonjs/core';
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera"
import { Engine } from "@babylonjs/core/Engines/engine"
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight"
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder"
import { Scene } from "@babylonjs/core/scene"
import { Vector3 } from "@babylonjs/core/Maths/math.vector"

import { SampleMaterial } from "./Materials/SampleMaterial"

const view = document.getElementById("view") as HTMLCanvasElement
const engine = new Engine(view, true)

let scene = new Scene(engine);
scene.debugLayer.show();

const camera = new ArcRotateCamera(
    "camera",
    Math.PI / 2,
    Math.PI / 3.2,
    2,
    Vector3.Zero(),
    scene)

camera.attachControl(view)

const light = new HemisphericLight(
    "light",
    new Vector3(0, 1, 0),
    scene)

const mesh = MeshBuilder.CreateGround("mesh", {}, scene)

// const material =  new SampleMaterial("material", scene)
// mesh.material = material;
mesh.material = getNodeMaterial();

engine.runRenderLoop(() => {
    scene.render();
});

function getNodeMaterial() {
    var nodeMaterial = new TEST.NodeMaterial("node");

    // InputBlock
    var position = new TEST.InputBlock("position");
    position.visibleInInspector = false;
    position.target = 1;
    position.setAsAttribute("position");

    // TransformBlock
    var WorldPos = new TEST.TransformBlock("WorldPos");
    WorldPos.visibleInInspector = false;
    WorldPos.target = 1;
    WorldPos.complementZ = 0;
    WorldPos.complementW = 1;

    // InputBlock
    var World = new TEST.InputBlock("World");
    World.visibleInInspector = false;
    World.target = 1;
    World.setAsSystemValue(TEST.NodeMaterialSystemValues.World);

    // TransformBlock
    var WorldPosViewProjectionTransform = new TEST.TransformBlock("WorldPos * ViewProjectionTransform");
    WorldPosViewProjectionTransform.visibleInInspector = false;
    WorldPosViewProjectionTransform.target = 1;
    WorldPosViewProjectionTransform.complementZ = 0;
    WorldPosViewProjectionTransform.complementW = 1;

    // InputBlock
    var ViewProjection = new TEST.InputBlock("ViewProjection");
    ViewProjection.visibleInInspector = false;
    ViewProjection.target = 1;
    ViewProjection.setAsSystemValue(TEST.NodeMaterialSystemValues.ViewProjection);

    // VertexOutputBlock
    var VertexOutput = new TEST.VertexOutputBlock("VertexOutput");
    VertexOutput.visibleInInspector = false;
    VertexOutput.target = 1;

    // InputBlock
    var color = new TEST.InputBlock("color");
    color.visibleInInspector = false;
    color.target = 1;
    color.value = new TEST.Color4(0.8, 0.8, 0.8, 1);
    color.isConstant = false;

    // FragmentOutputBlock
    var FragmentOutput = new TEST.FragmentOutputBlock("FragmentOutput");
    FragmentOutput.visibleInInspector = false;
    FragmentOutput.target = 2;

    // Connections
    position.output.connectTo(WorldPos.vector);
    World.output.connectTo(WorldPos.transform);
    WorldPos.output.connectTo(WorldPosViewProjectionTransform.vector);
    ViewProjection.output.connectTo(WorldPosViewProjectionTransform.transform);
    WorldPosViewProjectionTransform.output.connectTo(VertexOutput.vector);
    color.output.connectTo(FragmentOutput.rgba);

    // Output nodes
    nodeMaterial.addOutputNode(VertexOutput);
    nodeMaterial.addOutputNode(FragmentOutput);
    nodeMaterial.build();

    return nodeMaterial;
}
