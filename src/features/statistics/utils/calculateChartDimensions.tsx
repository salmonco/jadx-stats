interface Props {
  containerWidth: number;
  dataLength: number;
  minBarWidth?: number;
}

export const calculateChartDimensions = ({ containerWidth, dataLength, minBarWidth = 60 }: Props) => {
  const desiredWidth = dataLength * minBarWidth;
  const chartWidth = Math.max(desiredWidth, containerWidth);

  return { chartWidth };
};
