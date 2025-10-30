import { Extent } from "ol/extent";

export interface Bounds {
  left: number;
  bottom: number;
  right: number;
  top: number;
}

export interface XYZParams {
  zoom: number;
  res: number;
  maxExtent: Extent;
  tileSize: number;
  bounds: Bounds;
}

export interface XYZCoord {
  x: number;
  y: number;
  z: number;
}

export interface Geometry {
  type: "Polygon";
  coordinates: number[][][];
}

export interface FeatureCollection<T> {
  type: "FeatureCollection";
  features: T[];
}

export interface Layer {
  name: string;
  title: string;
  layerType: string;
  baseLayer: string;
}

export interface Layers {
  layers: {
    layer: Layer[];
  };
}

export interface Sld {
  name: string;
  href: string;
}

export interface Slds {
  styles: {
    style: Sld[];
  };
}

export interface FarmhouseSearhResult {
  stdg_cd: string;
  crs: any;
  schm: any;
  history: {
    history: {
      actor: string;
      timestamp: string;
      agrmen_ltlnd_uids: string[];
    };
  };
  del_yn: any;
  cache: any;
  remark: any;
  reg_id: any;
  del_dt: any;
  road_nm_addr: any;
  cntr_geom: {
    type: "Point";
    coordinates: [number, number];
  };
  update_id: any;
  lotno_addr?: string;
  rprs_lotno_addr?: string;
  update_dt: string;
  area: any;
  reg_dt: string;
  del_id: any;
  ltlnd_mst_uid: string;
  rprs_ltlnd_unq_no: string;
  altitude: any;
}

export interface Farmhouse {
  korn_flnm: string;
  agrmen_aply_no: string;
  tagrmen_ltlnd: [
    {
      lotno_addr: string;
      ltlnd_unq_no: string;
      cltvar: number;
      koc_dclsf_nm: string;
      ltlnd_mst_uid: string;
    },
  ];
  auto_geom: {
    type: "MultiPolygon";
    coordinates: any;
  };
}
