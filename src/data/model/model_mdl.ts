import { Pointer } from "../../utils/pointer";
import { Util } from "../../utils/util";
import { Data, Data2, Data3 } from "../data_types";
import { Material } from "../material";
import { Matrix } from "../matrix";
import { Texture2D } from "../texture/texture_2d";
import { Vector } from "../vector";
import { Vertex } from "../vertex";
import { Model } from "./model";

type MdlCoord = {isOnSeam: number, coord: Data2};
type MdlTriangle = {isFrontFace: boolean, vertexIndices: Data3};
type MdlVertex = {vertex: Data3, normalIndex: number}

export class ModelMdl extends Model {
    private static ident = 1330660425; // 'I' << 0 + 'D' << 8 + 'P' << 16 + 'O' << 24
    private static version = 6
    private static normals = [
        Data.xyz(-0.525731,  0.000000,  0.850651),
        Data.xyz(-0.442863,  0.238856,  0.864188),
        Data.xyz(-0.295242,  0.000000,  0.955423),
        Data.xyz(-0.309017,  0.500000,  0.809017),
        Data.xyz(-0.162460,  0.262866,  0.951056),
        Data.xyz( 0.000000,  0.000000,  1.000000),
        Data.xyz( 0.000000,  0.850651,  0.525731),
        Data.xyz(-0.147621,  0.716567,  0.681718),
        Data.xyz( 0.147621,  0.716567,  0.681718),
        Data.xyz( 0.000000,  0.525731,  0.850651),
        Data.xyz( 0.309017,  0.500000,  0.809017),
        Data.xyz( 0.525731,  0.000000,  0.850651),
        Data.xyz( 0.295242,  0.000000,  0.955423),
        Data.xyz( 0.442863,  0.238856,  0.864188),
        Data.xyz( 0.162460,  0.262866,  0.951056),
        Data.xyz(-0.681718,  0.147621,  0.716567),
        Data.xyz(-0.809017,  0.309017,  0.500000),
        Data.xyz(-0.587785,  0.425325,  0.688191),
        Data.xyz(-0.850651,  0.525731,  0.000000),
        Data.xyz(-0.864188,  0.442863,  0.238856),
        Data.xyz(-0.716567,  0.681718,  0.147621),
        Data.xyz(-0.688191,  0.587785,  0.425325),
        Data.xyz(-0.500000,  0.809017,  0.309017),
        Data.xyz(-0.238856,  0.864188,  0.442863),
        Data.xyz(-0.425325,  0.688191,  0.587785),
        Data.xyz(-0.716567,  0.681718, -0.147621),
        Data.xyz(-0.500000,  0.809017, -0.309017),
        Data.xyz(-0.525731,  0.850651,  0.000000),
        Data.xyz( 0.000000,  0.850651, -0.525731),
        Data.xyz(-0.238856,  0.864188, -0.442863),
        Data.xyz( 0.000000,  0.955423, -0.295242),
        Data.xyz(-0.262866,  0.951056, -0.162460),
        Data.xyz( 0.000000,  1.000000,  0.000000),
        Data.xyz( 0.000000,  0.955423,  0.295242),
        Data.xyz(-0.262866,  0.951056,  0.162460),
        Data.xyz( 0.238856,  0.864188,  0.442863),
        Data.xyz( 0.262866,  0.951056,  0.162460),
        Data.xyz( 0.500000,  0.809017,  0.309017),
        Data.xyz( 0.238856,  0.864188, -0.442863),
        Data.xyz( 0.262866,  0.951056, -0.162460),
        Data.xyz( 0.500000,  0.809017, -0.309017),
        Data.xyz( 0.850651,  0.525731,  0.000000),
        Data.xyz( 0.716567,  0.681718,  0.147621),
        Data.xyz( 0.716567,  0.681718, -0.147621),
        Data.xyz( 0.525731,  0.850651,  0.000000),
        Data.xyz( 0.425325,  0.688191,  0.587785),
        Data.xyz( 0.864188,  0.442863,  0.238856),
        Data.xyz( 0.688191,  0.587785,  0.425325),
        Data.xyz( 0.809017,  0.309017,  0.500000),
        Data.xyz( 0.681718,  0.147621,  0.716567),
        Data.xyz( 0.587785,  0.425325,  0.688191),
        Data.xyz( 0.955423,  0.295242,  0.000000),
        Data.xyz( 1.000000,  0.000000,  0.000000),
        Data.xyz( 0.951056,  0.162460,  0.262866),
        Data.xyz( 0.850651, -0.525731,  0.000000),
        Data.xyz( 0.955423, -0.295242,  0.000000),
        Data.xyz( 0.864188, -0.442863,  0.238856),
        Data.xyz( 0.951056, -0.162460,  0.262866),
        Data.xyz( 0.809017, -0.309017,  0.500000),
        Data.xyz( 0.681718, -0.147621,  0.716567),
        Data.xyz( 0.850651,  0.000000,  0.525731),
        Data.xyz( 0.864188,  0.442863, -0.238856),
        Data.xyz( 0.809017,  0.309017, -0.500000),
        Data.xyz( 0.951056,  0.162460, -0.262866),
        Data.xyz( 0.525731,  0.000000, -0.850651),
        Data.xyz( 0.681718,  0.147621, -0.716567),
        Data.xyz( 0.681718, -0.147621, -0.716567),
        Data.xyz( 0.850651,  0.000000, -0.525731),
        Data.xyz( 0.809017, -0.309017, -0.500000),
        Data.xyz( 0.864188, -0.442863, -0.238856),
        Data.xyz( 0.951056, -0.162460, -0.262866),
        Data.xyz( 0.147621,  0.716567, -0.681718),
        Data.xyz( 0.309017,  0.500000, -0.809017),
        Data.xyz( 0.425325,  0.688191, -0.587785),
        Data.xyz( 0.442863,  0.238856, -0.864188),
        Data.xyz( 0.587785,  0.425325, -0.688191),
        Data.xyz( 0.688191,  0.587785, -0.425325),
        Data.xyz(-0.147621,  0.716567, -0.681718),
        Data.xyz(-0.309017,  0.500000, -0.809017),
        Data.xyz( 0.000000,  0.525731, -0.850651),
        Data.xyz(-0.525731,  0.000000, -0.850651),
        Data.xyz(-0.442863,  0.238856, -0.864188),
        Data.xyz(-0.295242,  0.000000, -0.955423),
        Data.xyz(-0.162460,  0.262866, -0.951056),
        Data.xyz( 0.000000,  0.000000, -1.000000),
        Data.xyz( 0.295242,  0.000000, -0.955423),
        Data.xyz( 0.162460,  0.262866, -0.951056),
        Data.xyz(-0.442863, -0.238856, -0.864188),
        Data.xyz(-0.309017, -0.500000, -0.809017),
        Data.xyz(-0.162460, -0.262866, -0.951056),
        Data.xyz( 0.000000, -0.850651, -0.525731),
        Data.xyz(-0.147621, -0.716567, -0.681718),
        Data.xyz( 0.147621, -0.716567, -0.681718),
        Data.xyz( 0.000000, -0.525731, -0.850651),
        Data.xyz( 0.309017, -0.500000, -0.809017),
        Data.xyz( 0.442863, -0.238856, -0.864188),
        Data.xyz( 0.162460, -0.262866, -0.951056),
        Data.xyz( 0.238856, -0.864188, -0.442863),
        Data.xyz( 0.500000, -0.809017, -0.309017),
        Data.xyz( 0.425325, -0.688191, -0.587785),
        Data.xyz( 0.716567, -0.681718, -0.147621),
        Data.xyz( 0.688191, -0.587785, -0.425325),
        Data.xyz( 0.587785, -0.425325, -0.688191),
        Data.xyz( 0.000000, -0.955423, -0.295242),
        Data.xyz( 0.000000, -1.000000,  0.000000),
        Data.xyz( 0.262866, -0.951056, -0.162460),
        Data.xyz( 0.000000, -0.850651,  0.525731),
        Data.xyz( 0.000000, -0.955423,  0.295242),
        Data.xyz( 0.238856, -0.864188,  0.442863),
        Data.xyz( 0.262866, -0.951056,  0.162460),
        Data.xyz( 0.500000, -0.809017,  0.309017),
        Data.xyz( 0.716567, -0.681718,  0.147621),
        Data.xyz( 0.525731, -0.850651,  0.000000),
        Data.xyz(-0.238856, -0.864188, -0.442863),
        Data.xyz(-0.500000, -0.809017, -0.309017),
        Data.xyz(-0.262866, -0.951056, -0.162460),
        Data.xyz(-0.850651, -0.525731,  0.000000),
        Data.xyz(-0.716567, -0.681718, -0.147621),
        Data.xyz(-0.716567, -0.681718,  0.147621),
        Data.xyz(-0.525731, -0.850651,  0.000000),
        Data.xyz(-0.500000, -0.809017,  0.309017),
        Data.xyz(-0.238856, -0.864188,  0.442863),
        Data.xyz(-0.262866, -0.951056,  0.162460),
        Data.xyz(-0.864188, -0.442863,  0.238856),
        Data.xyz(-0.809017, -0.309017,  0.500000),
        Data.xyz(-0.688191, -0.587785,  0.425325),
        Data.xyz(-0.681718, -0.147621,  0.716567),
        Data.xyz(-0.442863, -0.238856,  0.864188),
        Data.xyz(-0.587785, -0.425325,  0.688191),
        Data.xyz(-0.309017, -0.500000,  0.809017),
        Data.xyz(-0.147621, -0.716567,  0.681718),
        Data.xyz(-0.425325, -0.688191,  0.587785),
        Data.xyz(-0.162460, -0.262866,  0.951056),
        Data.xyz( 0.442863, -0.238856,  0.864188),
        Data.xyz( 0.162460, -0.262866,  0.951056),
        Data.xyz( 0.309017, -0.500000,  0.809017),
        Data.xyz( 0.147621, -0.716567,  0.681718),
        Data.xyz( 0.000000, -0.525731,  0.850651),
        Data.xyz( 0.425325, -0.688191,  0.587785),
        Data.xyz( 0.587785, -0.425325,  0.688191),
        Data.xyz( 0.688191, -0.587785,  0.425325),
        Data.xyz(-0.955423,  0.295242,  0.000000),
        Data.xyz(-0.951056,  0.162460,  0.262866),
        Data.xyz(-1.000000,  0.000000,  0.000000),
        Data.xyz(-0.850651,  0.000000,  0.525731),
        Data.xyz(-0.955423, -0.295242,  0.000000),
        Data.xyz(-0.951056, -0.162460,  0.262866),
        Data.xyz(-0.864188,  0.442863, -0.238856),
        Data.xyz(-0.951056,  0.162460, -0.262866),
        Data.xyz(-0.809017,  0.309017, -0.500000),
        Data.xyz(-0.864188, -0.442863, -0.238856),
        Data.xyz(-0.951056, -0.162460, -0.262866),
        Data.xyz(-0.809017, -0.309017, -0.500000),
        Data.xyz(-0.681718,  0.147621, -0.716567),
        Data.xyz(-0.681718, -0.147621, -0.716567),
        Data.xyz(-0.850651,  0.000000, -0.525731),
        Data.xyz(-0.688191,  0.587785, -0.425325),
        Data.xyz(-0.587785,  0.425325, -0.688191),
        Data.xyz(-0.425325,  0.688191, -0.587785),
        Data.xyz(-0.425325, -0.688191, -0.587785),
        Data.xyz(-0.587785, -0.425325, -0.688191),
        Data.xyz(-0.688191, -0.587785, -0.425325),
    ];
    private static colorsPalette = [
        Data.rgb(0x00, 0x00, 0x00),
        Data.rgb(0x0f, 0x0f, 0x0f),
        Data.rgb(0x1f, 0x1f, 0x1f),
        Data.rgb(0x2f, 0x2f, 0x2f),
        Data.rgb(0x3f, 0x3f, 0x3f),
        Data.rgb(0x4b, 0x4b, 0x4b),
        Data.rgb(0x5b, 0x5b, 0x5b),
        Data.rgb(0x6b, 0x6b, 0x6b),
        Data.rgb(0x7b, 0x7b, 0x7b),
        Data.rgb(0x8b, 0x8b, 0x8b),
        Data.rgb(0x9b, 0x9b, 0x9b),
        Data.rgb(0xab, 0xab, 0xab),
        Data.rgb(0xbb, 0xbb, 0xbb),
        Data.rgb(0xcb, 0xcb, 0xcb),
        Data.rgb(0xdb, 0xdb, 0xdb),
        Data.rgb(0xeb, 0xeb, 0xeb),
        Data.rgb(0x0f, 0x0b, 0x07),
        Data.rgb(0x17, 0x0f, 0x0b),
        Data.rgb(0x1f, 0x17, 0x0b),
        Data.rgb(0x27, 0x1b, 0x0f),
        Data.rgb(0x2f, 0x23, 0x13),
        Data.rgb(0x37, 0x2b, 0x17),
        Data.rgb(0x3f, 0x2f, 0x17),
        Data.rgb(0x4b, 0x37, 0x1b),
        Data.rgb(0x53, 0x3b, 0x1b),
        Data.rgb(0x5b, 0x43, 0x1f),
        Data.rgb(0x63, 0x4b, 0x1f),
        Data.rgb(0x6b, 0x53, 0x1f),
        Data.rgb(0x73, 0x57, 0x1f),
        Data.rgb(0x7b, 0x5f, 0x23),
        Data.rgb(0x83, 0x67, 0x23),
        Data.rgb(0x8f, 0x6f, 0x23),
        Data.rgb(0x0b, 0x0b, 0x0f),
        Data.rgb(0x13, 0x13, 0x1b),
        Data.rgb(0x1b, 0x1b, 0x27),
        Data.rgb(0x27, 0x27, 0x33),
        Data.rgb(0x2f, 0x2f, 0x3f),
        Data.rgb(0x37, 0x37, 0x4b),
        Data.rgb(0x3f, 0x3f, 0x57),
        Data.rgb(0x47, 0x47, 0x67),
        Data.rgb(0x4f, 0x4f, 0x73),
        Data.rgb(0x5b, 0x5b, 0x7f),
        Data.rgb(0x63, 0x63, 0x8b),
        Data.rgb(0x6b, 0x6b, 0x97),
        Data.rgb(0x73, 0x73, 0xa3),
        Data.rgb(0x7b, 0x7b, 0xaf),
        Data.rgb(0x83, 0x83, 0xbb),
        Data.rgb(0x8b, 0x8b, 0xcb),
        Data.rgb(0x00, 0x00, 0x00),
        Data.rgb(0x07, 0x07, 0x00),
        Data.rgb(0x0b, 0x0b, 0x00),
        Data.rgb(0x13, 0x13, 0x00),
        Data.rgb(0x1b, 0x1b, 0x00),
        Data.rgb(0x23, 0x23, 0x00),
        Data.rgb(0x2b, 0x2b, 0x07),
        Data.rgb(0x2f, 0x2f, 0x07),
        Data.rgb(0x37, 0x37, 0x07),
        Data.rgb(0x3f, 0x3f, 0x07),
        Data.rgb(0x47, 0x47, 0x07),
        Data.rgb(0x4b, 0x4b, 0x0b),
        Data.rgb(0x53, 0x53, 0x0b),
        Data.rgb(0x5b, 0x5b, 0x0b),
        Data.rgb(0x63, 0x63, 0x0b),
        Data.rgb(0x6b, 0x6b, 0x0f),
        Data.rgb(0x07, 0x00, 0x00),
        Data.rgb(0x0f, 0x00, 0x00),
        Data.rgb(0x17, 0x00, 0x00),
        Data.rgb(0x1f, 0x00, 0x00),
        Data.rgb(0x27, 0x00, 0x00),
        Data.rgb(0x2f, 0x00, 0x00),
        Data.rgb(0x37, 0x00, 0x00),
        Data.rgb(0x3f, 0x00, 0x00),
        Data.rgb(0x47, 0x00, 0x00),
        Data.rgb(0x4f, 0x00, 0x00),
        Data.rgb(0x57, 0x00, 0x00),
        Data.rgb(0x5f, 0x00, 0x00),
        Data.rgb(0x67, 0x00, 0x00),
        Data.rgb(0x6f, 0x00, 0x00),
        Data.rgb(0x77, 0x00, 0x00),
        Data.rgb(0x7f, 0x00, 0x00),
        Data.rgb(0x13, 0x13, 0x00),
        Data.rgb(0x1b, 0x1b, 0x00),
        Data.rgb(0x23, 0x23, 0x00),
        Data.rgb(0x2f, 0x2b, 0x00),
        Data.rgb(0x37, 0x2f, 0x00),
        Data.rgb(0x43, 0x37, 0x00),
        Data.rgb(0x4b, 0x3b, 0x07),
        Data.rgb(0x57, 0x43, 0x07),
        Data.rgb(0x5f, 0x47, 0x07),
        Data.rgb(0x6b, 0x4b, 0x0b),
        Data.rgb(0x77, 0x53, 0x0f),
        Data.rgb(0x83, 0x57, 0x13),
        Data.rgb(0x8b, 0x5b, 0x13),
        Data.rgb(0x97, 0x5f, 0x1b),
        Data.rgb(0xa3, 0x63, 0x1f),
        Data.rgb(0xaf, 0x67, 0x23),
        Data.rgb(0x23, 0x13, 0x07),
        Data.rgb(0x2f, 0x17, 0x0b),
        Data.rgb(0x3b, 0x1f, 0x0f),
        Data.rgb(0x4b, 0x23, 0x13),
        Data.rgb(0x57, 0x2b, 0x17),
        Data.rgb(0x63, 0x2f, 0x1f),
        Data.rgb(0x73, 0x37, 0x23),
        Data.rgb(0x7f, 0x3b, 0x2b),
        Data.rgb(0x8f, 0x43, 0x33),
        Data.rgb(0x9f, 0x4f, 0x33),
        Data.rgb(0xaf, 0x63, 0x2f),
        Data.rgb(0xbf, 0x77, 0x2f),
        Data.rgb(0xcf, 0x8f, 0x2b),
        Data.rgb(0xdf, 0xab, 0x27),
        Data.rgb(0xef, 0xcb, 0x1f),
        Data.rgb(0xff, 0xf3, 0x1b),
        Data.rgb(0x0b, 0x07, 0x00),
        Data.rgb(0x1b, 0x13, 0x00),
        Data.rgb(0x2b, 0x23, 0x0f),
        Data.rgb(0x37, 0x2b, 0x13),
        Data.rgb(0x47, 0x33, 0x1b),
        Data.rgb(0x53, 0x37, 0x23),
        Data.rgb(0x63, 0x3f, 0x2b),
        Data.rgb(0x6f, 0x47, 0x33),
        Data.rgb(0x7f, 0x53, 0x3f),
        Data.rgb(0x8b, 0x5f, 0x47),
        Data.rgb(0x9b, 0x6b, 0x53),
        Data.rgb(0xa7, 0x7b, 0x5f),
        Data.rgb(0xb7, 0x87, 0x6b),
        Data.rgb(0xc3, 0x93, 0x7b),
        Data.rgb(0xd3, 0xa3, 0x8b),
        Data.rgb(0xe3, 0xb3, 0x97),
        Data.rgb(0xab, 0x8b, 0xa3),
        Data.rgb(0x9f, 0x7f, 0x97),
        Data.rgb(0x93, 0x73, 0x87),
        Data.rgb(0x8b, 0x67, 0x7b),
        Data.rgb(0x7f, 0x5b, 0x6f),
        Data.rgb(0x77, 0x53, 0x63),
        Data.rgb(0x6b, 0x4b, 0x57),
        Data.rgb(0x5f, 0x3f, 0x4b),
        Data.rgb(0x57, 0x37, 0x43),
        Data.rgb(0x4b, 0x2f, 0x37),
        Data.rgb(0x43, 0x27, 0x2f),
        Data.rgb(0x37, 0x1f, 0x23),
        Data.rgb(0x2b, 0x17, 0x1b),
        Data.rgb(0x23, 0x13, 0x13),
        Data.rgb(0x17, 0x0b, 0x0b),
        Data.rgb(0x0f, 0x07, 0x07),
        Data.rgb(0xbb, 0x73, 0x9f),
        Data.rgb(0xaf, 0x6b, 0x8f),
        Data.rgb(0xa3, 0x5f, 0x83),
        Data.rgb(0x97, 0x57, 0x77),
        Data.rgb(0x8b, 0x4f, 0x6b),
        Data.rgb(0x7f, 0x4b, 0x5f),
        Data.rgb(0x73, 0x43, 0x53),
        Data.rgb(0x6b, 0x3b, 0x4b),
        Data.rgb(0x5f, 0x33, 0x3f),
        Data.rgb(0x53, 0x2b, 0x37),
        Data.rgb(0x47, 0x23, 0x2b),
        Data.rgb(0x3b, 0x1f, 0x23),
        Data.rgb(0x2f, 0x17, 0x1b),
        Data.rgb(0x23, 0x13, 0x13),
        Data.rgb(0x17, 0x0b, 0x0b),
        Data.rgb(0x0f, 0x07, 0x07),
        Data.rgb(0xdb, 0xc3, 0xbb),
        Data.rgb(0xcb, 0xb3, 0xa7),
        Data.rgb(0xbf, 0xa3, 0x9b),
        Data.rgb(0xaf, 0x97, 0x8b),
        Data.rgb(0xa3, 0x87, 0x7b),
        Data.rgb(0x97, 0x7b, 0x6f),
        Data.rgb(0x87, 0x6f, 0x5f),
        Data.rgb(0x7b, 0x63, 0x53),
        Data.rgb(0x6b, 0x57, 0x47),
        Data.rgb(0x5f, 0x4b, 0x3b),
        Data.rgb(0x53, 0x3f, 0x33),
        Data.rgb(0x43, 0x33, 0x27),
        Data.rgb(0x37, 0x2b, 0x1f),
        Data.rgb(0x27, 0x1f, 0x17),
        Data.rgb(0x1b, 0x13, 0x0f),
        Data.rgb(0x0f, 0x0b, 0x07),
        Data.rgb(0x6f, 0x83, 0x7b),
        Data.rgb(0x67, 0x7b, 0x6f),
        Data.rgb(0x5f, 0x73, 0x67),
        Data.rgb(0x57, 0x6b, 0x5f),
        Data.rgb(0x4f, 0x63, 0x57),
        Data.rgb(0x47, 0x5b, 0x4f),
        Data.rgb(0x3f, 0x53, 0x47),
        Data.rgb(0x37, 0x4b, 0x3f),
        Data.rgb(0x2f, 0x43, 0x37),
        Data.rgb(0x2b, 0x3b, 0x2f),
        Data.rgb(0x23, 0x33, 0x27),
        Data.rgb(0x1f, 0x2b, 0x1f),
        Data.rgb(0x17, 0x23, 0x17),
        Data.rgb(0x0f, 0x1b, 0x13),
        Data.rgb(0x0b, 0x13, 0x0b),
        Data.rgb(0x07, 0x0b, 0x07),
        Data.rgb(0xff, 0xf3, 0x1b),
        Data.rgb(0xef, 0xdf, 0x17),
        Data.rgb(0xdb, 0xcb, 0x13),
        Data.rgb(0xcb, 0xb7, 0x0f),
        Data.rgb(0xbb, 0xa7, 0x0f),
        Data.rgb(0xab, 0x97, 0x0b),
        Data.rgb(0x9b, 0x83, 0x07),
        Data.rgb(0x8b, 0x73, 0x07),
        Data.rgb(0x7b, 0x63, 0x07),
        Data.rgb(0x6b, 0x53, 0x00),
        Data.rgb(0x5b, 0x47, 0x00),
        Data.rgb(0x4b, 0x37, 0x00),
        Data.rgb(0x3b, 0x2b, 0x00),
        Data.rgb(0x2b, 0x1f, 0x00),
        Data.rgb(0x1b, 0x0f, 0x00),
        Data.rgb(0x0b, 0x07, 0x00),
        Data.rgb(0x00, 0x00, 0xff),
        Data.rgb(0x0b, 0x0b, 0xef),
        Data.rgb(0x13, 0x13, 0xdf),
        Data.rgb(0x1b, 0x1b, 0xcf),
        Data.rgb(0x23, 0x23, 0xbf),
        Data.rgb(0x2b, 0x2b, 0xaf),
        Data.rgb(0x2f, 0x2f, 0x9f),
        Data.rgb(0x2f, 0x2f, 0x8f),
        Data.rgb(0x2f, 0x2f, 0x7f),
        Data.rgb(0x2f, 0x2f, 0x6f),
        Data.rgb(0x2f, 0x2f, 0x5f),
        Data.rgb(0x2b, 0x2b, 0x4f),
        Data.rgb(0x23, 0x23, 0x3f),
        Data.rgb(0x1b, 0x1b, 0x2f),
        Data.rgb(0x13, 0x13, 0x1f),
        Data.rgb(0x0b, 0x0b, 0x0f),
        Data.rgb(0x2b, 0x00, 0x00),
        Data.rgb(0x3b, 0x00, 0x00),
        Data.rgb(0x4b, 0x07, 0x00),
        Data.rgb(0x5f, 0x07, 0x00),
        Data.rgb(0x6f, 0x0f, 0x00),
        Data.rgb(0x7f, 0x17, 0x07),
        Data.rgb(0x93, 0x1f, 0x07),
        Data.rgb(0xa3, 0x27, 0x0b),
        Data.rgb(0xb7, 0x33, 0x0f),
        Data.rgb(0xc3, 0x4b, 0x1b),
        Data.rgb(0xcf, 0x63, 0x2b),
        Data.rgb(0xdb, 0x7f, 0x3b),
        Data.rgb(0xe3, 0x97, 0x4f),
        Data.rgb(0xe7, 0xab, 0x5f),
        Data.rgb(0xef, 0xbf, 0x77),
        Data.rgb(0xf7, 0xd3, 0x8b),
        Data.rgb(0xa7, 0x7b, 0x3b),
        Data.rgb(0xb7, 0x9b, 0x37),
        Data.rgb(0xc7, 0xc3, 0x37),
        Data.rgb(0xe7, 0xe3, 0x57),
        Data.rgb(0x7f, 0xbf, 0xff),
        Data.rgb(0xab, 0xe7, 0xff),
        Data.rgb(0xd7, 0xff, 0xff),
        Data.rgb(0x67, 0x00, 0x00),
        Data.rgb(0x8b, 0x00, 0x00),
        Data.rgb(0xb3, 0x00, 0x00),
        Data.rgb(0xd7, 0x00, 0x00),
        Data.rgb(0xff, 0x00, 0x00),
        Data.rgb(0xff, 0xf3, 0x93),
        Data.rgb(0xff, 0xf7, 0xc7),
        Data.rgb(0xff, 0xff, 0xff),
        Data.rgb(0x9f, 0x5b, 0x53),
    ];

    static async create(gl: WebGL2RenderingContext, fileName: string): Promise<ModelMdl> {
        return await new ModelMdl().init([gl, fileName]);
    }

    protected async init(args: Array<any>): Promise<this> {
        let [gl, fileName] = args as [WebGL2RenderingContext, string];

        let pointer = new Pointer(await Util.arrayBuffer(fileName))

        // Header
        let ident = pointer.readInt32();
        let version = pointer.readInt32();

        let scale = pointer.readData3Float32();
        let translate = pointer.readData3Float32();
        let boundingRadius = pointer.readFloat32();
        let eyePosition = pointer.readData3Float32();

        let texturesCount = pointer.readInt32();
        let textureSize = pointer.readData2Int32();

        let verticesCount = pointer.readInt32();
        let trianglesCount = pointer.readInt32();
        let framesCount = pointer.readInt32();

        let syncType = pointer.readInt32();
        let flags = pointer.readInt32();
        let size = pointer.readInt32();

        // Textures
        if (texturesCount > 1)
            throw new Error("Multiple textures not implemented");

        let isTexturesGroup = pointer.readBool32();
        if (isTexturesGroup)
            throw new Error("Texture groups not implemented");

        let pixelsCount = textureSize.x * textureSize.y;
        let textureData = new Uint8Array(pixelsCount * 3);
        for (let i=0; i<pixelsCount; i++) {
            let colorsPaletteIndex = pointer.readUint8();
            let color = ModelMdl.colorsPalette[colorsPaletteIndex];
            textureData.set(color.m, i*3);
        }
        let texture = await Texture2D.create(gl, textureData, textureSize);
        let material = new Material(Data.rgb(1, 1, 1), 0.1, 1, 0, false, texture);

        // Texture Coords
        let mdlCoords = new Array<MdlCoord>;
        for (let i=0; i<verticesCount; i++) {
            let value: MdlCoord = {
                isOnSeam: pointer.readInt32(),
                coord: pointer.readData2Int32(),
            }
            mdlCoords.push(value);
        }

        // Triangles
        let mdlTriangles = new Array<MdlTriangle>;
        for (let i=0; i<trianglesCount; i++) {
            let value: MdlTriangle = {
                isFrontFace: pointer.readBool32(),
                vertexIndices: pointer.readData3Int32(),
            }
            mdlTriangles.push(value);
        }

        // Frames
        let vertices: Array<Vertex> = [];
        for (let frameIndex=0; frameIndex<1; frameIndex++) {
            // Is frames group
            let isFramesGroup = pointer.readBool32();
            if (isFramesGroup)
                throw new Error("Frames group not yet implemented");

            // Bounding box min
            pointer.skip(Uint8Array.BYTES_PER_ELEMENT * 4);

            // Bounding box max
            pointer.skip(Uint8Array.BYTES_PER_ELEMENT * 4);

            // Name
            pointer.skip(Uint8Array.BYTES_PER_ELEMENT * 16);

            // Vertices
            let mdlVertices = new Array<MdlVertex>;
            for (let i=0; i<verticesCount; i++) {
                let value: MdlVertex = {
                    vertex: pointer.readData3Uint8(),
                    normalIndex: pointer.readUint8(),
                };
                mdlVertices.push(value);
            }

            for (let triangleIndex = 0; triangleIndex < trianglesCount; triangleIndex++) {
                let triangle = mdlTriangles[triangleIndex];

                triangle.vertexIndices.m.forEach((vertexIndex) => {
                    let vertex = mdlVertices[vertexIndex];
                    let coord = mdlCoords[vertexIndex];

                    // Adjust texture coordinates
                    let texCoordSOffset = 0;
                    if (!triangle.isFrontFace && coord.isOnSeam)
                        texCoordSOffset = textureSize.x / 2;

                    // Fix orientation (because X is forward and Z is up)
                    let position = new Vector(
                        vertex.vertex.x * scale.x + translate.x,
                        vertex.vertex.y * scale.y + translate.y,
                        vertex.vertex.z * scale.z + translate.z,
                    );

                    let normal = new Vector(
                        ModelMdl.normals[vertex.normalIndex].x,
                        ModelMdl.normals[vertex.normalIndex].y,
                        ModelMdl.normals[vertex.normalIndex].z,
                    );

                    let matrix = Matrix.makeRotationZ(Math.PI).multiply(Matrix.makeRotationX(Math.PI/2));
                    position = matrix.multiplyVector(position)
                    normal = matrix.multiplyVector(normal);

                    // From z to x to make it CCW
                    let modelVertex = new Vertex(
                        Data.xyz(
                            position.z,
                            position.y,
                            position.x,
                        ),
                        Data.xyz(
                            normal.z,
                            normal.y,
                            normal.x,
                        ),
                        Data.st(
                            (coord.coord.s + texCoordSOffset + 0.5) / textureSize.x,
                            (coord.coord.t + 0.5) / textureSize.y,
                        )
                    );
                    vertices.push(modelVertex)
                });
            }
        }

        await super.init([vertices, material]);
        return this;
    }
}