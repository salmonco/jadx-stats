import { useEffect, useCallback, useMemo, useRef } from "react";
import { Feature, MapBrowserEvent, Overlay } from "ol";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Style, Fill, Stroke, Text } from "ol/style";
import GeoJSON from "ol/format/GeoJSON";
import { cropColorScale, hexToRgb, crops, colors } from "~/utils/gitUtils";
import { features } from "process";


const useCropDistributionLayer = ({ layerManager, map, ready, selectedLvl, setMenuPosition, setMenuChildren, cropData, hexData, opacity, areaData }) => {
    const labelOverlaysRef = useRef<Overlay[]>([]);
    
    const cropStyleFunc = useCallback(        
        (feature: Feature) => {
            const pummok = feature.get("top_pummok");
            const col = cropColorScale(pummok);
            const [r, g, b] = hexToRgb(col);
            return new Style({
                fill: new Fill({ color: `rgba(${r}, ${g}, ${b}, ${opacity})` }),
                stroke: new Stroke({ color: "rgba(0, 0, 0, 0.2)", width: 1 }),
            });
        },
        [opacity]
    );

    const hexStyleFunc = useMemo(
        () => (feature: Feature) => {
            const pummok = feature.get("top_pummok");
            const opacity = feature.get("opacity");
            const col = cropColorScale(pummok);
            const [r, g, b] = hexToRgb(col);
            return new Style({
                fill: new Fill({ color: `rgba(${r}, ${g}, ${b}, ${opacity.toFixed(3)})` }),
                stroke: new Stroke({ color: "rgba(0, 0, 0, 0.2)", width: 1 }),
            });
        },
        []
    );

    const cropMap = {
        "제주": "감귤",
        "애월": "감귤",
        "한림": "브로콜리, 양배추",
        "한경": "양파, 양배추",
        "대정": "마늘",
        "안덕": "감귤",
        "서귀": "감귤",
        "남원": "감귤",
        "표선": "무, 감귤",
        "성산": "무",
        "구좌": "감자, 당근, 쪽파",
        "조천": "감귤"
    };

    const cropColors = {
        "감귤": "#d90000",
        "브로콜리": "#008000",
        "양배추": "#4567d6",
        "양파": "#FFFF00",
        "마늘": "#d9c050",
        "무": "#e4fc6f",
        "감자": "#8B4513",
        "당근": "#ff6a00",
        "쪽파": "#00FF00"
      };

    useEffect(() => {
        if (!ready || !map || selectedLvl !== 'lvl2' || !cropData) return;
      
        const labelPoints = [
          { coords: [14084741.54255216, 3968362.445965245], label: "감귤" },
          { coords: [14094623.386682251, 3921127.5421339516], label: "감귤" },
          { coords: [14064339.89581765, 3963111.4726507855], label: "양배추" },
          { coords: [14053404.570776949, 3957069.8435237273], label: "브로콜리" },
          { coords: [14039759.342826782, 3937213.684230725], label: "양파" },
          { coords: [14044558.698864426, 3922062.775955022], label: "마늘" },
          { coords: [14104603.266656337, 3973799.8309659706], label: "감자" },
          { coords: [14121212.110426985, 3970825.2195466147], label: "당근" },
          { coords: [14137385.331939882, 3964888.5655965405], label: "쪽파" },
          { coords: [14129224.521090006, 3941880.9783812263], label: "무" },
        ];
      
        // crops와 colors를 매핑하여 crop → color 맵 생성
        const cropColorMap = crops.reduce((map, crop, idx) => {
          map[crop] = colors[idx];
          return map;
        }, {} as Record<string, string>);
              
        const labelStyles: Record<string,{background: string; color: string; cropName: string; totalArea: number;}> = {};

        cropData.features.forEach((feature: any) => {
        const cropName = feature.properties.top_pummok;
        const background = cropColorMap[cropName] || "white";
        const color = ["#e4fc6f", "#FFFF00", "#FF6347", "#98FB98", "#00FF00"].includes(background)
            ? "black"
            : "white";

        if (!labelStyles[cropName]) {
            labelStyles[cropName] = { background, color, cropName, totalArea: 0 };
        }

        const mandarinArea = feature.properties.mandarin_area || 0;    
        const total = mandarinArea;

        labelStyles[cropName].totalArea += total;
        });
      
        // 기존 overlay 제거
        labelOverlaysRef.current.forEach((overlay) => {
          map.removeOverlay(overlay);
        });
        labelOverlaysRef.current = [];
      
        const labelDivs: HTMLDivElement[] = [];
      
        labelPoints.forEach(({ coords, label }) => {
          const div = document.createElement("div");
          div.innerText = label;
      
          const { background = "white", color = "black" } = labelStyles[label] || {};
      
          div.style.cssText = `
            background: ${background};
            color: ${color};
            border: 1px solid black;
            padding: 10px 20px;
            border-radius: 40px;
            font-size: 14px;
            transition: all 0.3s ease;
            cursor: pointer;
          `;
          
          let tooltipOverlay: Overlay | null = null;
          div.addEventListener("mouseenter", () => {
            let curPumok = "";
            labelDivs.forEach((el) => {
              if(el === div) curPumok = el.textContent;
              el.style.opacity = el === div ? "1" : "0.2";
            });
            div.style.transform = "scale(1.1)";
          
            // 툴팁 div 생성
            const tooltip = document.createElement("div");
            tooltip.style.cssText = `
              background: #3D4C6E;
              border-radius: 6px;
              padding: 18px;
              color: white;
              font-size: 16px;
            `;
            
            const nameDiv = document.createElement("div");
            nameDiv.style.cssText = `                            
              margin-bottom:8px;
            `;
            nameDiv.innerText = label;
        
            const totalDiv = document.createElement("div");            
            // totalDiv.style.cssText = `              
            //   font-size: 14px;
            // `;
            totalDiv.innerText = `총 재배면적: ${labelStyles[label]?.totalArea?.toLocaleString() ?? "0"}㎡`;

            tooltip.appendChild(nameDiv);
            tooltip.appendChild(totalDiv);

            // 툴팁 오버레이 생성 및 지도에 추가
            tooltipOverlay = new Overlay({
              element: tooltip,
              position: coords,
              offset: [180, 0],
              positioning: "bottom-center",
              stopEvent: false,
            });
            map.addOverlay(tooltipOverlay);

            const Layer = layerManager.getLayer("cropLayer");            
            if (Layer.layer instanceof VectorLayer) {                
                const source = Layer.layer.getSource();
                if (source instanceof VectorSource) {
                    const features = source.getFeatures();
                    features.forEach(feature => {
                        const pummok = feature.get("top_pummok");
                        const col = cropColorScale(pummok);                        
                        const [r, g, b] = hexToRgb(col);
                        if(feature.get("top_pummok") == curPumok){                            
                            feature.setStyle(new Style({
                                fill: new Fill({ color: `rgba(${r}, ${g}, ${b}, 0.7)` }),
                                stroke: new Stroke({ color: "rgba(0, 0, 0, 0.2)", width: 1 }),
                            })); 
                        } else {
                            feature.setStyle(new Style({
                                fill: new Fill({ color: `rgba(${r}, ${g}, ${b}, 0.1)` }),
                                stroke: new Stroke({ color: "rgba(0, 0, 0, 0.2)", width: 1 }),
                            })); 
                        }
                    });
                }
            }
          });
          
          div.addEventListener("mouseleave", () => {
            labelDivs.forEach((el) => {
              el.style.opacity = "1";
            });
            div.style.transform = "scale(1)";
          
            // 툴팁 제거
            if (tooltipOverlay) {
              map.removeOverlay(tooltipOverlay);
              tooltipOverlay = null;
            }
            
            const Layer = layerManager.getLayer("cropLayer");
            if (Layer.layer instanceof VectorLayer) {
                const source = Layer.layer.getSource();
                if (source instanceof VectorSource) {
                    const features = source.getFeatures();
                    features.forEach(feature => {
                        const pummok = feature.get("top_pummok");
                        const col = cropColorScale(pummok);
                        const [r, g, b] = hexToRgb(col);                      
                        feature.setStyle(new Style({
                            fill: new Fill({ color: `rgba(${r}, ${g}, ${b}, 0.7)` }),
                            stroke: new Stroke({ color: "rgba(0, 0, 0, 0.2)", width: 1 }),
                        })); 
                    });
                }
            }
          });
      
          const overlay = new Overlay({
            position: coords,
            positioning: "bottom-center",
            element: div,
            stopEvent: false,
          });
      
          map.addOverlay(overlay);
          labelOverlaysRef.current.push(overlay);
          labelDivs.push(div);
        });
      
        return () => {
          labelOverlaysRef.current.forEach((overlay) => {
            map.removeOverlay(overlay);
          });
          labelOverlaysRef.current = [];
        };
      }, [map, ready, selectedLvl, cropData]);

    useEffect(() => {
        if (!ready || !map) return;
    
        const view = map.getView();
    
        if (selectedLvl === "lvl2" && cropData) {
            const targetZoom = 10.5;
            const targetCenter = [14088492.864310395, 3947183.1430401835];
    
            const cropFeatures = new GeoJSON().readFeatures(cropData);
            layerManager.removeLayer("leftLayer");
            layerManager.removeLayer("rightLayer");
            layerManager.removeLayer("hexLayer");
            layerManager.addOrReplaceLayer("cropLayer", cropFeatures, { style: cropStyleFunc });
            
            view.animate({
                center: targetCenter,
                zoom: targetZoom,
                duration: 500,
            });
        } else if (selectedLvl === "lvl1" && hexData) {
            const targetZoom = 12;
            const targetCenter = [14086425.618121266, 3953829.0508725857]; //제주
            
            const hexFeatures = new GeoJSON().readFeatures(hexData);
            layerManager.removeLayer("areaLayer");
            layerManager.removeLayer("cropLayer");
            layerManager.addOrReplaceLayer("hexLayer", hexFeatures, { style: hexStyleFunc });
    
            view.animate({
                center: targetCenter,
                zoom: targetZoom,
                duration: 500,
            });
        }
    }, [ready, map, selectedLvl, cropData, hexData, areaData]);

    // 스타일 업데이트
    useEffect(() => {
        if (selectedLvl === "lvl2" && map) {
            const cropLayer = layerManager.getLayer("cropLayer");
            if (cropLayer) cropLayer.setStyle(cropStyleFunc);
        }
    }, [opacity, map, cropStyleFunc, selectedLvl]);

    // 이벤트 핸들러 설정
    useEffect(() => {
        if (!ready || !map) return;

        let highlightedFeature = null;
        let originalStyle = null;

        const highlightStyle = new Style({
            stroke: new Stroke({
                color: "yellow",
                width: 3,
            }),
            fill: new Fill({
                color: "rgba(255, 255, 0, 0.3)",
            }),
        });

        // const handlePointerMove = (event: MapBrowserEvent<MouseEvent>) => {
        //     if (highlightedFeature) {
        //         (highlightedFeature as Feature).setStyle(originalStyle);
        //         highlightedFeature = null;
        //         map.getTargetElement().style.cursor = "";
        //     }

        //     map.forEachFeatureAtPixel(event.pixel, (featureLike) => {
        //         const feature = featureLike as Feature;
        //         highlightedFeature = feature;
        //         originalStyle = feature.getStyle();
        //         feature.setStyle(highlightStyle);
        //         map.getTargetElement().style.cursor = "pointer";
        //         return true;
        //     });
        // };
        const handlePointerMove = (event: MapBrowserEvent<MouseEvent>) => {
            if (highlightedFeature) {
                (highlightedFeature as Feature).setStyle(originalStyle);
                highlightedFeature = null;
                map.getTargetElement().style.cursor = "";
                setMenuChildren(null); // 툴팁 숨김
            }
        
            map.forEachFeatureAtPixel(event.pixel, (featureLike) => {
                const feature = featureLike as Feature;                
                highlightedFeature = feature;
                originalStyle = feature.getStyle();
                feature.setStyle(highlightStyle);
                map.getTargetElement().style.cursor = "pointer";
        
                const featureType = feature.get("feature_type");
                const side: "full" | "left" | "right" = feature.get("side");
        
                if (featureType === "mandarin") {
                    const area = feature.get("mandarin_area");
                    setMenuPosition({ x: Math.round(event.pixel[0]), y: Math.round(event.pixel[1]) });
                    setMenuChildren(<div>{`감귤 재배면적: ${area.toLocaleString()}㎡`}</div>);
                } else if (featureType === "rest" || !!side) {
                    const pummok = feature.get("top_pummok");
                    const pummokData = feature.get("pummok_data");
                    let pummokPrefix = "면적 1위 품목";
                    if (side === "right") {
                        pummokPrefix = "면적 2위 품목";
                    }
                    const children = (
                        <div>
                            <div >{`${pummokPrefix}: ${pummok}`}</div>
                            <div style={{ width: "100%", height: "1px", backgroundColor: "white", marginTop:"10px", marginBottom:"10px" }} />
                            {/* {pummokData.map((item, index) => (
                                <div key={index}>{`${item.pummok}: ${item.area.toLocaleString()}㎡`}</div>
                            ))} */}
                            {pummokData.map((item, index) => {
                                const ha = item.area / 10000;
                                return (
                                    <div key={index}>
                                        {`${item.pummok}: ${ha.toFixed(2)} ha`}
                                    </div>
                                );
                            })}
                        </div>
                    );
                    setMenuPosition({ x: Math.round(event.pixel[0]), y: Math.round(event.pixel[1]) });
                    setMenuChildren(children);
                }
        
                return true;
            });
        };

        const handlePointerMove2 = (event: MapBrowserEvent<MouseEvent>) => {
            let featureAtPixel: Feature | null = null;
            map.forEachFeatureAtPixel(event.pixel, (featureLike) => { 
                highlightedFeature = featureLike as Feature;  
                featureAtPixel = featureLike as Feature;
                return true;
            });
            let tooltip = document.getElementById("map-tooltip");
            if (!tooltip) {
              tooltip = document.createElement("div");
              tooltip.id = "map-tooltip";
              tooltip.style.position = "absolute";
              tooltip.style.pointerEvents = "none";
              tooltip.style.zIndex = "9999";
              tooltip.style.padding = "18px";
              tooltip.style.borderRadius = "6px";
              tooltip.style.minWidth = "150px";
              tooltip.style.fontSize = "13px";
              tooltip.style.color = "white";
              tooltip.style.background = "#3D4C6E";             
              document.body.appendChild(tooltip);
            }

            const Layer = layerManager.getLayer("areaLayer");
            if (Layer.layer instanceof VectorLayer) {
                const source = Layer.layer.getSource();
                if (source instanceof VectorSource) {
                    const features = source.getFeatures();
                    features.forEach(feature => {
                        if(featureAtPixel && feature.get("feature_type") != "crop" ){                                        
                            if(feature == highlightedFeature){      
                                const region = feature.get("vrbs_nm");
                                // 지역에 해당하는 작물 리스트 가져오기                                
                                const crops = cropMap[region]?.split(", ").map(c => c.trim()) || [];
                                
                                // 작물별 div 생성
                                const cropsHtml = crops.map(crop => {
                                const background = cropColors[crop] || "#000000";                                
                                const color = ["#e4fc6f", "#FFFF00", "#FF6347", "#98FB98", "#00FF00"].includes(background)
                                ? "black"
                                : "white";
                                return `  
                                    <div style="background: ${background}; color: ${color}; display: flex; align-items: center; padding: 10px 20px; margin-bottom: 4px; border: 1px solid black; border-radius: 40px; font-size: 14px;">
                                    <div style="color: ${color}; font-size: 16px; font-weight: bold;">
                                        ${crop}
                                    </div>
                                    </div>
                                `;
                                }).join("");

                                tooltip.innerHTML = `
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="color: #FFC132; font-size: 18px;">▶</div>
                                    <div style="color: #FFC132; font-size: 16px; font-weight: bold;">
                                    ${region}
                                    </div>
                                </div>
                                <div style="font-size: 13px; color: black; background: white; width: 100%; margin-top: 6px; padding: 4px; border-radius: 4px;">
                                    주요 재배작물
                                </div>
                                <div style="margin-top: 6px; display:flex;">
                                    ${cropsHtml}
                                </div>
                                `;       
                                tooltip.style.left = `${event.originalEvent.clientX + 15}px`;
                                tooltip.style.top = `${event.originalEvent.clientY - 10}px`;
                                tooltip.style.display = "block";
                                feature.setStyle(new Style({
                                    fill: new Fill({color: `rgba(253, 253, 253, 0.01)` }),
                                    stroke: new Stroke({ color: `rgba(37, 37, 37, 0.7)`, width: 1 }),
                                })); 
                            } else {                                
                                feature.setStyle(new Style({
                                    fill: new Fill({color: `rgba(20, 20, 20, 0.8)` }),
                                    stroke: new Stroke({ color: `rgba(20, 20, 20, 0.3)`, width: 1 }),
                                }));
                            }
                        } else {
                            feature.setStyle(new Style({
                                fill: new Fill({color: `rgba(253, 253, 253, 0.1)` }),
                                stroke: new Stroke({ color: `rgba(70, 160, 244, 0.3)`, width: 2 }),
                            }));
                        }
                    });
                    if (!featureAtPixel) {
                        tooltip.style.display = "none";
                    }
                    const mapDiv = document.getElementById('map');

                    mapDiv.addEventListener('mouseleave', () => {
                    tooltip.style.display = 'none';
                    });
                }
            }
        };

        const handleClick = (event: MapBrowserEvent<MouseEvent>) => {            
            map.forEachFeatureAtPixel(event.pixel, (featureLike) => {                
                const feature = featureLike as Feature;                                
                const featureType = feature.get("feature_type");
                const side: "full" | "left" | "right" = feature.get("side");

                if (featureType === "mandarin") {
                    const area = feature.get("mandarin_area");
                    setMenuPosition({ x: Math.round(event.pixel[0]), y: Math.round(event.pixel[1]) });
                    setMenuChildren(<div>{`감귤 재배면적: ${area.toLocaleString()}㎡`}</div>);
                } else if (featureType === "rest" || !!side) {
                    const pummok = feature.get("top_pummok");
                    const pummokData = feature.get("pummok_data");
                    setMenuPosition({ x: Math.round(event.pixel[0]), y: Math.round(event.pixel[1]) });
                    let pummokPrefix = "면적 1위 품목";
                    if (side === "right") {
                        pummokPrefix = "면적 2위 품목";
                    }
                    const children = (
                        <div>
                            <div>{`${pummokPrefix}: ${pummok}`}</div>
                            {pummokData.map((item, index) => (
                                <div key={index}>{`${item.pummok}: ${item.area0.toLocaleString()}㎡`}</div>
                            ))}
                        </div>
                    );
                    setMenuChildren(children);
                }
                return true;
            });
        };

        if (selectedLvl === "lvl1") {
            map.un("pointermove", handlePointerMove2);
            map.on("pointermove", handlePointerMove);
            map.on("singleclick", handleClick);
        } else {
            map.un("pointermove", handlePointerMove);
            map.on("pointermove", handlePointerMove2);
            map.un("singleclick", handleClick);
        }
        
        return () => {
            if (highlightedFeature) (highlightedFeature as Feature).setStyle(originalStyle);
            map.un("pointermove", handlePointerMove);
            map.un("pointermove", handlePointerMove2);
            map.un("singleclick", handleClick);
        };
    }, [ready, map, selectedLvl]);

    const areaStyleFunc = useMemo(
        () => (feature: Feature) => {
            return new Style({
                fill: new Fill({color: `rgba(253, 253, 253, 0.01)` }),
                stroke: new Stroke({ color: `rgba(250, 254, 253, 0.03)`, width: 0.3 }),
            });
        },
        []
    );
    // 권역지도 표시
    useEffect(() => {
        if (!ready || !map) return;

        if (selectedLvl === "lvl2" && areaData) {
            const areaFeatures = new GeoJSON().readFeatures(areaData);
            layerManager.removeLayer("areaLayer");
            layerManager.addOrReplaceLayer("areaLayer", areaFeatures, areaStyleFunc);
        }
    }, [ready, map, selectedLvl]);
};

export default useCropDistributionLayer;
