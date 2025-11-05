import InfoTooltip from "~/components/InfoTooltip";
import { MANDARIN_TREE_AGE_DISTRIBUTION_TITLE } from "~/pages/visualization/observation/MandarinTreeAgeDistribution";
import { infoTooltipContents } from "~/utils/InfoTooltipContents";

const MandarinTreeAgeDistributionTooltip = () => {
  return <InfoTooltip content={infoTooltipContents[MANDARIN_TREE_AGE_DISTRIBUTION_TITLE]} />;
};

export default MandarinTreeAgeDistributionTooltip;
