import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart } from "recharts";

// 전국 산업별 취업자 수 데이터 (1989-2024)
const nationalEmploymentData = [
  { year: 1989, agriculture: 3, mining: 5, service: 5, retail: 4, total: 17 },
  { year: 1990, agriculture: 3, mining: 5, service: 6, retail: 4, total: 18 },
  { year: 1991, agriculture: 3, mining: 5, service: 6, retail: 4, total: 18 },
  { year: 1992, agriculture: 3, mining: 5, service: 7, retail: 5, total: 19 },
  { year: 1993, agriculture: 3, mining: 5, service: 7, retail: 5, total: 19 },
  { year: 1994, agriculture: 2, mining: 5, service: 7, retail: 5, total: 20 },
  { year: 1995, agriculture: 2, mining: 5, service: 8, retail: 6, total: 21 },
  { year: 1996, agriculture: 2, mining: 5, service: 8, retail: 6, total: 21 },
  { year: 1997, agriculture: 2, mining: 4, service: 8, retail: 6, total: 20 },
  { year: 1998, agriculture: 2, mining: 4, service: 8, retail: 6, total: 20 },
  { year: 1999, agriculture: 2, mining: 4, service: 9, retail: 6, total: 21 },
  { year: 2000, agriculture: 2, mining: 4, service: 9, retail: 6, total: 21 },
  { year: 2001, agriculture: 2, mining: 4, service: 10, retail: 6, total: 22 },
  { year: 2002, agriculture: 2, mining: 4, service: 10, retail: 6, total: 22 },
  { year: 2003, agriculture: 2, mining: 4, service: 11, retail: 6, total: 22 },
  { year: 2004, agriculture: 2, mining: 4, service: 11, retail: 6, total: 23 },
  { year: 2005, agriculture: 2, mining: 4, service: 11, retail: 6, total: 23 },
  { year: 2006, agriculture: 2, mining: 4, service: 12, retail: 6, total: 23 },
  { year: 2007, agriculture: 2, mining: 4, service: 12, retail: 6, total: 23 },
  { year: 2008, agriculture: 2, mining: 4, service: 12, retail: 6, total: 23 },
  { year: 2009, agriculture: 2, mining: 4, service: 13, retail: 5, total: 24 },
  { year: 2010, agriculture: 2, mining: 4, service: 13, retail: 6, total: 25 },
  { year: 2011, agriculture: 1, mining: 4, service: 14, retail: 6, total: 25 },
  { year: 2012, agriculture: 1, mining: 4, service: 14, retail: 6, total: 26 },
  { year: 2013, agriculture: 1, mining: 5, service: 14, retail: 6, total: 26 },
  { year: 2014, agriculture: 1, mining: 5, service: 14, retail: 6, total: 26 },
  { year: 2015, agriculture: 1, mining: 5, service: 15, retail: 6, total: 27 },
  { year: 2016, agriculture: 1, mining: 5, service: 15, retail: 6, total: 27 },
  { year: 2017, agriculture: 1, mining: 4, service: 15, retail: 6, total: 27 },
  { year: 2018, agriculture: 1, mining: 4, service: 16, retail: 5, total: 27 },
  { year: 2019, agriculture: 1, mining: 4, service: 16, retail: 5, total: 28 },
  { year: 2020, agriculture: 1, mining: 4, service: 16, retail: 5, total: 28 },
  { year: 2021, agriculture: 1, mining: 4, service: 16, retail: 5, total: 28 },
  { year: 2022, agriculture: 1, mining: 4, service: 17, retail: 5, total: 28 },
  { year: 2023, agriculture: 1, mining: 4, service: 17, retail: 5, total: 28 },
  { year: 2024, agriculture: 1, mining: 4, service: 17, retail: 5, total: 28 },
];

// 산업별 색상 설정
const colorMap = {
  agriculture: "#e74c3c", // 농림어업 - 강조를 위해 빨간색
  mining: "#f39c12", // 광공업
  service: "#7f8c8d", // SOC, 기타 서비스
  retail: "#3498db", // 도소매, 숙박, 음식점업
  total: "#2c3e50", // 전체
};

// 한글 레이블 매핑
const koreanLabels = {
  agriculture: "농림어업",
  mining: "광공업",
  service: "SOC, 기타서비스",
  retail: "도소매,숙박,음식점업",
  total: "전체",
};

export default function NationalEmploymentTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={nationalEmploymentData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 14 }} tickCount={10} domain={["dataMin", "dataMax"]} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 14 }} domain={[0, 30]} />
        <Tooltip
          formatter={(value, name) => [`${value}백만명`, koreanLabels[name] || name]}
          labelFormatter={(label) => `${label}년`}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #f0f0f0",
            borderRadius: "4px",
            padding: "10px",
          }}
        />
        <Legend formatter={(value) => koreanLabels[value] || value} verticalAlign="bottom" wrapperStyle={{ paddingTop: "10px" }} />
        <Line
          type="monotone"
          dataKey="agriculture"
          stroke={colorMap.agriculture}
          name="agriculture"
          strokeWidth={4} // 농림어업 강조를 위해 선 두께 증가
          dot={{ r: 3, strokeWidth: 2 }} // 점 크기 및 테두리 두께 증가
          activeDot={{ r: 6 }} // 활성화된 점 크기 증가
        />
        <Line type="monotone" dataKey="mining" stroke={colorMap.mining} name="mining" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="service" stroke={colorMap.service} name="service" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="retail" stroke={colorMap.retail} name="retail" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="total" stroke={colorMap.total} name="total" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
