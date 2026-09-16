export type Quality = 'full' | 'reduced' | 'static';
export interface ProductConfig {
 id:string; modelUrl:string; fallbackImage:string; camera:[number,number,number];
 lighting:'apothecary'; labelTextures:string[]; accessibilityText:string; movingPart:string;
 ingredientCues:{kind:'orange'|'honey'|'frankincense';position:[number,number,number]}[];
 interaction:{idle:number;pointer:number};
 stages:{rotation:number;lift:number;scale:number;ingredients:number}[];
}
export const balm:ProductConfig={
 id:'balm',modelUrl:'assets/3d/tallow-balm.v1.glb',fallbackImage:'assets/3d/tallow-balm-static.v1.webp',
 camera:[0,1.05,4.4],lighting:'apothecary',labelTextures:['FrontLabel','BackLabel','TopLabel'],movingPart:'Lid',
 ingredientCues:[{kind:'orange',position:[-1.2,.1,.1]},{kind:'honey',position:[1.15,.35,.1]},{kind:'frankincense',position:[.92,-.7,.25]}],
 accessibilityText:'SF Tallow Balm in an amber jar with a black lid and supplied burgundy and gold label artwork. Packaging dimensions are illustrative.',
 interaction:{idle:.025,pointer:.12},
 stages:[{rotation:-.22,lift:0,scale:1,ingredients:0},{rotation:0,lift:0,scale:1.08,ingredients:0},{rotation:.22,lift:.022,scale:.86,ingredients:0},{rotation:-.15,lift:.024,scale:.80,ingredients:1},{rotation:0,lift:0,scale:1,ingredients:0},{rotation:-.25,lift:0,scale:.85,ingredients:0}]
};
