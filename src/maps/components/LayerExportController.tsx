import React, { SetStateAction } from "react";
import { Button } from "antd";

interface Props {
  isCreatingLayer: boolean;
  setModalToggle: React.Dispatch<SetStateAction<boolean>>;
}

const LayerExportController = ({ isCreatingLayer, setModalToggle }: Props) => {
  return (
    <div className="absolute right-12 top-[200px] opacity-[0.65]">
      {isCreatingLayer ? (
        <Button onClick={() => setModalToggle(true)}>생성중...</Button>
      ) : (
        <Button onClick={() => setModalToggle(true)}>{isCreatingLayer ? "생성중..." : "레이어 생성"}</Button>
      )}
    </div>
  );
};

export default LayerExportController;
