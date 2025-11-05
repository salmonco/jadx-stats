import InfoTooltip from "~/components/InfoTooltip";
import { MANDARIN_CULTIVATION_INFO_TITLE } from "~/pages/visualization/production/MandarinCultivationInfo";
import { infoTooltipContents } from "~/utils/InfoTooltipContents";

const MandarinCultivationInfoTooltip = () => {
  return <InfoTooltip content={infoTooltipContents[MANDARIN_CULTIVATION_INFO_TITLE]} />;
};

export default MandarinCultivationInfoTooltip;
