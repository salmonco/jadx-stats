import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart } from "recharts";

// 제주 노지감귤 개화일자 데이터 (2016-2024)
const floweringData = [
  {
    year: 2016,
    jejuCity: "5월 4일",
    seogwipoCity: "5월 3일",
    jejuCityValue: 15, // 4월 19일부터 일수 (5월 4일)
    seogwipoCityValue: 14, // 4월 19일부터 일수 (5월 3일)
    jejuTrend: 16.5, // 추세선 값
    seogwipoTrend: 15.5, // 추세선 값
  },
  {
    year: 2017,
    jejuCity: "5월 5일",
    seogwipoCity: "5월 3일",
    jejuCityValue: 16, // 4월 19일부터 일수 (5월 5일)
    seogwipoCityValue: 14, // 4월 19일부터 일수 (5월 3일)
    jejuTrend: 16, // 추세선 값
    seogwipoTrend: 15, // 추세선 값
  },
  {
    year: 2018,
    jejuCity: "5월 4일",
    seogwipoCity: "5월 2일",
    jejuCityValue: 15, // 4월 19일부터 일수 (5월 4일)
    seogwipoCityValue: 13, // 4월 19일부터 일수 (5월 2일)
    jejuTrend: 15.5, // 추세선 값
    seogwipoTrend: 14.5, // 추세선 값
  },
  {
    year: 2019,
    jejuCity: "5월 5일",
    seogwipoCity: "5월 1일",
    jejuCityValue: 16, // 4월 19일부터 일수 (5월 5일)
    seogwipoCityValue: 12, // 4월 19일부터 일수 (5월 1일)
    jejuTrend: 15, // 추세선 값
    seogwipoTrend: 14, // 추세선 값
  },
  {
    year: 2020,
    jejuCity: "5월 5일",
    seogwipoCity: "5월 3일",
    jejuCityValue: 16, // 4월 19일부터 일수 (5월 5일)
    seogwipoCityValue: 14, // 4월 19일부터 일수 (5월 3일)
    jejuTrend: 14.5, // 추세선 값
    seogwipoTrend: 13.5, // 추세선 값
  },
  {
    year: 2021,
    jejuCity: "4월 30일",
    seogwipoCity: "4월 23일",
    jejuCityValue: 11, // 4월 19일부터 일수 (4월 30일)
    seogwipoCityValue: 4, // 4월 19일부터 일수 (4월 23일)
    jejuTrend: 14, // 추세선 값
    seogwipoTrend: 13, // 추세선 값
  },
  {
    year: 2022,
    jejuCity: "5월 4일",
    seogwipoCity: "4월 30일",
    jejuCityValue: 15, // 4월 19일부터 일수 (5월 4일)
    seogwipoCityValue: 11, // 4월 19일부터 일수 (4월 30일)
    jejuTrend: 13.5, // 추세선 값
    seogwipoTrend: 12.5, // 추세선 값
  },
  {
    year: 2023,
    jejuCity: "4월 30일",
    seogwipoCity: "4월 27일",
    jejuCityValue: 11, // 4월 19일부터 일수 (4월 30일)
    seogwipoCityValue: 8, // 4월 19일부터 일수 (4월 27일)
    jejuTrend: 13, // 추세선 값
    seogwipoTrend: 12, // 추세선 값
  },
  {
    year: 2024,
    jejuCity: "4월 30일",
    seogwipoCity: "4월 28일",
    jejuCityValue: 11, // 4월 19일부터 일수 (4월 30일)
    seogwipoCityValue: 9, // 4월 19일부터 일수 (4월 28일)
    jejuTrend: 12.5, // 추세선 값
    seogwipoTrend: 11.5, // 추세선 값
  },
];

// Y축에 표시할 날짜 목록
const yAxisTicks = [
  0, // 4월 19일
  2, // 4월 21일
  4, // 4월 23일
  6, // 4월 25일
  8, // 4월 27일
  10, // 4월 29일
  12, // 5월 1일
  14, // 5월 3일
  16, // 5월 5일
  18, // 5월 7일
];

// 날짜 값을 포맷팅하는 함수
const formatYAxis = (value) => {
  const dates = ["4월 19일", "4월 21일", "4월 23일", "4월 25일", "4월 27일", "4월 29일", "5월 1일", "5월 3일", "5월 5일", "5월 7일"];
  return dates[value / 2] || "";
};

export default function FloweringTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={floweringData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.5} horizontal={true} vertical={false} />
        <XAxis dataKey="year" type="number" domain={[2016, 2024]} ticks={[2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]} tick={{ fontSize: 12 }} />
        <YAxis
          domain={[0, 18]} // 4월 19일부터 5월 7일까지
          tickFormatter={formatYAxis}
          tick={{ fontSize: 12 }}
          ticks={yAxisTicks}
          reversed={false} // 값이 커질수록 위로 올라가도록 설정
          orientation="left"
          width={60}
        />
        <Tooltip
          formatter={(value, name, props) => {
            if (name === "jejuCityValue") return floweringData[props.payload.index].jejuCity;
            if (name === "seogwipoCityValue") return floweringData[props.payload.index].seogwipoCity;
            if (name === "jejuTrend" || name === "seogwipoTrend") return formatYAxis(value);
            return value;
          }}
          labelFormatter={(label) => `${label}년`}
        />
        <Legend verticalAlign="bottom" align="center" />

        {/* 제주시 데이터 */}
        <Line
          type="monotone"
          dataKey="jejuCityValue"
          stroke="#ef4444"
          name="제주시"
          strokeWidth={2}
          dot={{ r: 5, fill: "#ef4444" }}
          activeDot={{ r: 7 }}
          isAnimationActive={false}
          label={({ x, y, value, index }) => (
            <text x={x} y={y - 10} fill="#ef4444" fontSize={12} textAnchor="middle">
              {floweringData[index].jejuCity}
            </text>
          )}
        />

        {/* 서귀포시 데이터 */}
        <Line
          type="monotone"
          dataKey="seogwipoCityValue"
          stroke="#1e40af"
          name="서귀포시"
          strokeWidth={2}
          dot={{ r: 5, fill: "#1e40af" }}
          activeDot={{ r: 7 }}
          isAnimationActive={false}
          label={({ x, y, value, index }) => (
            <text x={x} y={y + 15} fill="#1e40af" fontSize={12} textAnchor="middle">
              {floweringData[index].seogwipoCity}
            </text>
          )}
        />

        {/* 제주시 추세선 */}
        <Line
          type="monotone"
          dataKey="jejuTrend"
          stroke="#ef4444"
          strokeDasharray="5 5"
          dot={false}
          activeDot={false}
          name="jejuTrend"
          isAnimationActive={false}
          legendType="none"
        />

        {/* 서귀포시 추세선 */}
        <Line
          type="monotone"
          dataKey="seogwipoTrend"
          stroke="#1e40af"
          strokeDasharray="5 5"
          dot={false}
          activeDot={false}
          name="seogwipoTrend"
          isAnimationActive={false}
          legendType="none"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
