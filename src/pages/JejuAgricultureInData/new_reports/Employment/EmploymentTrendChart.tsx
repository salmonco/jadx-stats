import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart } from "recharts";

// 제주 산업별 취업자 수 데이터 (1989-2024)
const EmploymentData = [
  { year: 1989, agriculture: 98, mining: 10, service: 74, retail: 41, total: 223 },
  { year: 1990, agriculture: 99, mining: 10, service: 83, retail: 47, total: 239 },
  { year: 1991, agriculture: 84, mining: 10, service: 92, retail: 53, total: 239 },
  { year: 1992, agriculture: 77, mining: 11, service: 93, retail: 58, total: 246 },
  { year: 1993, agriculture: 76, mining: 14, service: 95, retail: 59, total: 244 },
  { year: 1994, agriculture: 72, mining: 14, service: 93, retail: 65, total: 244 },
  { year: 1995, agriculture: 70, mining: 13, service: 100, retail: 64, total: 247 },
  { year: 1996, agriculture: 70, mining: 12, service: 101, retail: 69, total: 252 },
  { year: 1997, agriculture: 71, mining: 12, service: 103, retail: 75, total: 261 },
  { year: 1998, agriculture: 73, mining: 9, service: 99, retail: 64, total: 245 },
  { year: 1999, agriculture: 68, mining: 8, service: 101, retail: 66, total: 243 },
  { year: 2000, agriculture: 71, mining: 10, service: 106, retail: 73, total: 260 },
  { year: 2001, agriculture: 68, mining: 13, service: 110, retail: 74, total: 265 },
  { year: 2002, agriculture: 65, mining: 14, service: 120, retail: 75, total: 274 },
  { year: 2003, agriculture: 75, mining: 12, service: 122, retail: 73, total: 282 },
  { year: 2004, agriculture: 72, mining: 11, service: 124, retail: 73, total: 280 },
  { year: 2005, agriculture: 69, mining: 11, service: 131, retail: 74, total: 285 },
  { year: 2006, agriculture: 64, mining: 10, service: 142, retail: 73, total: 289 },
  { year: 2007, agriculture: 63, mining: 8, service: 144, retail: 72, total: 287 },
  { year: 2008, agriculture: 60, mining: 10, service: 149, retail: 69, total: 288 },
  { year: 2009, agriculture: 56, mining: 11, service: 148, retail: 73, total: 288 },
  { year: 2010, agriculture: 56, mining: 10, service: 148, retail: 70, total: 284 },
  { year: 2011, agriculture: 63, mining: 11, service: 156, retail: 64, total: 294 },
  { year: 2012, agriculture: 67, mining: 11, service: 159, retail: 65, total: 302 },
  { year: 2013, agriculture: 62, mining: 14, service: 163, retail: 70, total: 309 },
  { year: 2014, agriculture: 53, mining: 13, service: 170, retail: 85, total: 321 },
  { year: 2015, agriculture: 55, mining: 14, service: 176, retail: 95, total: 340 },
  { year: 2016, agriculture: 57, mining: 14, service: 191, retail: 93, total: 355 },
  { year: 2017, agriculture: 55, mining: 13, service: 214, retail: 93, total: 375 },
  { year: 2018, agriculture: 59, mining: 12, service: 211, retail: 90, total: 372 },
  { year: 2019, agriculture: 67, mining: 12, service: 214, retail: 89, total: 382 },
  { year: 2020, agriculture: 74, mining: 13, service: 202, retail: 90, total: 379 },
  { year: 2021, agriculture: 67, mining: 15, service: 209, retail: 93, total: 384 },
  { year: 2022, agriculture: 63, mining: 16, service: 225, retail: 98, total: 402 },
  { year: 2023, agriculture: 58, mining: 15, service: 235, retail: 100, total: 402 },
  { year: 2024, agriculture: 50, mining: 13, service: 239, retail: 98, total: 400 },
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

export default function EmploymentTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={EmploymentData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 14 }} tickCount={10} domain={["dataMin", "dataMax"]} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 14 }} domain={[0, 450]} />
        <Tooltip
          formatter={(value, name) => [`${value}천명`, koreanLabels[name] || name]}
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
