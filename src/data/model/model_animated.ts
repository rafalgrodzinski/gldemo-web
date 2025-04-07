import { Material } from "../material";
import { Vertex } from "../vertex";
import { VertexAnimated } from "../vertex_animated";
import { Anim } from "./anim";

export abstract class ModelAnimated {
    verticesCount!: number;
    material!: Material;
    anims!: Array<Anim>;
    framesData!: Float32Array;

    protected async init(args: Array<any>): Promise<this> {
                let [frames, material, anims] = args as [Array<Array<Vertex>>, Material, Array<Anim>];
        
                this.verticesCount = frames[0].length;
                this.material = material;
                this.anims = anims ?? [];

                // Convert frames of vertices into an array of vertices animated
                let verticesAnimated: Array<VertexAnimated> = [];
                anims.forEach((anim) => {
                    for (let frameIndex = anim.startFrame; frameIndex <= anim.endFrame; frameIndex++) {
                        let nextFrameIndex = frameIndex == anim.endFrame ? anim.startFrame : frameIndex + 1;
                        for (let vertexIndex = 0; vertexIndex < this.verticesCount; vertexIndex++) {
                            let currentVertex = frames[frameIndex][vertexIndex];
                            let nextVertex = frames[nextFrameIndex][vertexIndex];
                            let vertexAnimated = new VertexAnimated(
                                currentVertex.position,
                                nextVertex.position,
                                currentVertex.normal,
                                nextVertex.normal,
                                currentVertex.texCoord
                            );
                            verticesAnimated.push(vertexAnimated);
                        }
                    }
                });

                // Construct data buffer out of the vertices animated
                this.framesData = new Float32Array(frames.length * this.verticesCount * VertexAnimated.STRIDE_LENGTH);
                verticesAnimated.forEach((vertexAnimated, i) => {
                    this.framesData.set(vertexAnimated.m, i * VertexAnimated.STRIDE_LENGTH);
                });
        
                return this;
    }
}