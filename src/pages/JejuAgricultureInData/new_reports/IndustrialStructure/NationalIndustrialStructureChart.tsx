import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart } from "recharts";

// 전국(제주제외) 산업별 생산구조 변화 데이터 (1985-2023)
const nationalData = [
  { year: 1985, total: 90.3, agriculture: 7.7, manufacturing: 21.3, construction: 14.7, retail: 19.7, service: 47.3 },
  { year: 1986, total: 91.5, agriculture: 7.3, manufacturing: 22.2, construction: 13.6, retail: 19.6, service: 46.6 },
  { year: 1987, total: 92.8, agriculture: 6.3, manufacturing: 23.5, construction: 13.3, retail: 19.5, service: 45.2 },
  { year: 1988, total: 93.8, agriculture: 6.3, manufacturing: 23.7, construction: 12.8, retail: 19.4, service: 44.4 },
  { year: 1989, total: 93.2, agriculture: 5.8, manufacturing: 23.3, construction: 13.4, retail: 19.6, service: 45.3 },
  { year: 1990, total: 92.6, agriculture: 5.0, manufacturing: 23.7, construction: 15.0, retail: 19.3, service: 44.9 },
  { year: 1991, total: 92.6, agriculture: 4.6, manufacturing: 23.9, construction: 15.7, retail: 19.1, service: 44.6 },
  { year: 1992, total: 93.0, agriculture: 4.8, manufacturing: 23.8, construction: 14.4, retail: 18.8, service: 45.7 },
  { year: 1993, total: 93.0, agriculture: 4.3, manufacturing: 23.9, construction: 14.4, retail: 18.6, service: 46.3 },
  { year: 1994, total: 93.7, agriculture: 4.1, manufacturing: 24.7, construction: 13.6, retail: 18.5, service: 45.8 },
  { year: 1995, total: 94.2, agriculture: 4.0, manufacturing: 25.1, construction: 14.0, retail: 18.3, service: 44.9 },
  { year: 1996, total: 94.9, agriculture: 3.9, manufacturing: 25.3, construction: 13.0, retail: 18.4, service: 44.8 },
  { year: 1997, total: 95.0, agriculture: 3.7, manufacturing: 25.3, construction: 12.8, retail: 18.3, service: 45.2 },
  { year: 1998, total: 94.8, agriculture: 3.7, manufacturing: 24.3, construction: 11.7, retail: 17.4, service: 48.4 },
  { year: 1999, total: 96.4, agriculture: 3.5, manufacturing: 25.9, construction: 9.5, retail: 18.1, service: 46.7 },
  { year: 2000, total: 97.5, agriculture: 3.2, manufacturing: 27.2, construction: 8.4, retail: 18.0, service: 45.7 },
  { year: 2001, total: 97.6, agriculture: 3.1, manufacturing: 26.7, construction: 8.4, retail: 18.1, service: 46.1 },
  { year: 2002, total: 98.2, agriculture: 2.7, manufacturing: 27.2, construction: 8.1, retail: 17.8, service: 46.0 },
  { year: 2003, total: 98.0, agriculture: 2.5, manufacturing: 27.5, construction: 8.5, retail: 16.9, service: 46.6 },
  { year: 2004, total: 98.2, agriculture: 2.5, manufacturing: 28.6, construction: 8.3, retail: 16.4, service: 46.0 },
  { year: 2005, total: 98.4, agriculture: 2.4, manufacturing: 28.9, construction: 8.0, retail: 16.1, service: 46.3 },
  { year: 2006, total: 98.4, agriculture: 2.4, manufacturing: 29.4, construction: 7.7, retail: 15.9, service: 46.3 },
  { year: 2007, total: 98.7, agriculture: 2.3, manufacturing: 29.6, construction: 7.4, retail: 15.8, service: 46.2 },
  { year: 2008, total: 98.9, agriculture: 2.4, manufacturing: 29.6, construction: 6.9, retail: 15.8, service: 46.4 },
  { year: 2009, total: 98.9, agriculture: 2.4, manufacturing: 29.1, construction: 6.9, retail: 15.4, service: 47.2 },
  { year: 2010, total: 99.5, agriculture: 2.2, manufacturing: 31.2, construction: 6.2, retail: 15.7, service: 45.2 },
  { year: 2011, total: 99.7, agriculture: 2.1, manufacturing: 31.6, construction: 5.7, retail: 15.9, service: 45.0 },
  { year: 2012, total: 99.9, agriculture: 2.0, manufacturing: 31.4, construction: 5.6, retail: 16.2, service: 45.0 },
  { year: 2013, total: 100.0, agriculture: 2.1, manufacturing: 31.2, construction: 5.6, retail: 16.1, service: 45.1 },
  { year: 2014, total: 100.0, agriculture: 2.1, manufacturing: 31.3, construction: 5.5, retail: 15.8, service: 45.4 },
  { year: 2015, total: 100.0, agriculture: 2.1, manufacturing: 31.0, construction: 5.7, retail: 15.8, service: 45.5 },
  { year: 2016, total: 99.9, agriculture: 1.9, manufacturing: 30.6, construction: 6.1, retail: 15.7, service: 45.8 },
  { year: 2017, total: 100.0, agriculture: 1.8, manufacturing: 30.9, construction: 6.3, retail: 15.6, service: 45.4 },
  { year: 2018, total: 100.0, agriculture: 1.7, manufacturing: 30.8, construction: 6.0, retail: 15.6, service: 45.9 },
  { year: 2019, total: 100.0, agriculture: 1.8, manufacturing: 30.3, construction: 5.8, retail: 15.7, service: 46.5 },
  { year: 2020, total: 100.0, agriculture: 1.6, manufacturing: 30.0, construction: 5.8, retail: 14.8, service: 47.7 },
  { year: 2021, total: 100.0, agriculture: 1.6, manufacturing: 30.5, construction: 5.5, retail: 14.8, service: 47.6 },
  { year: 2022, total: 100.0, agriculture: 1.6, manufacturing: 30.4, construction: 5.4, retail: 15.4, service: 47.3 },
  { year: 2023, total: 100.5, agriculture: 1.5, manufacturing: 29.8, construction: 5.4, retail: 15.4, service: 47.3 },
];

// 산업별 색상 설정
const colorMap = {
  total: "#4478c8",
  agriculture: "#e74c3c",
  manufacturing: "#7f8c8d",
  construction: "#f39c12",
  retail: "#3498db",
  service: "#2ecc71",
};

// 한글 레이블 매핑
const koreanLabels = {
  total: "부가가치합",
  agriculture: "농림, 임업 및 어업",
  manufacturing: "광제조업",
  construction: "건설업",
  retail: "도매운수숙박음식점",
  service: "서비스업",
};

export default function NationalIndustrialStructureChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={nationalData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 14 }} tickCount={10} domain={["dataMin", "dataMax"]} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 14 }} domain={[0, 60]} tickFormatter={(value) => `${value}%`} />
        <Tooltip
          formatter={(value, name) => [`${value}%`, koreanLabels[name] || name]}
          labelFormatter={(label) => `${label}년`}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #d9d9d9",
            borderRadius: "4px",
            padding: "10px",
          }}
        />
        <Legend
          formatter={(value) => <span style={{ fontSize: 14 }}>{koreanLabels[value] || value}</span>}
          verticalAlign="bottom"
          wrapperStyle={{ paddingTop: "10px" }}
        />
        <Line type="monotone" dataKey="total" stroke={colorMap.total} name="total" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
        <Line
          type="monotone"
          dataKey="agriculture"
          stroke={colorMap.agriculture}
          name="agriculture"
          strokeWidth={4} // 농림어업 강조를 위해 선 두께 증가
          dot={{ r: 3, strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
        <Line type="monotone" dataKey="manufacturing" stroke={colorMap.manufacturing} name="manufacturing" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="construction" stroke={colorMap.construction} name="construction" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="retail" stroke={colorMap.retail} name="retail" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="service" stroke={colorMap.service} name="service" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
