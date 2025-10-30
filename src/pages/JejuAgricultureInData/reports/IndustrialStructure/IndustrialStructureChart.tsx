import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart } from "recharts";

// 제주 산업별 생산구조 변화 데이터 (1985-2023)
const industrialData = [
  { year: 1985, total: 91.2, agriculture: 28.7, manufacturing: 4.6, construction: 13.2, retail: 13.6, service: 49.5 },
  { year: 1986, total: 92.2, agriculture: 27.5, manufacturing: 4.6, construction: 11.7, retail: 14.2, service: 50.6 },
  { year: 1987, total: 92.7, agriculture: 27.4, manufacturing: 4.3, construction: 13.3, retail: 15.6, service: 47.2 },
  { year: 1988, total: 92.3, agriculture: 24.4, manufacturing: 4.6, construction: 14.9, retail: 14.7, service: 47.1 },
  { year: 1989, total: 95.2, agriculture: 27.2, manufacturing: 5.0, construction: 14.5, retail: 16.7, service: 41.6 },
  { year: 1990, total: 93.5, agriculture: 22.6, manufacturing: 5.5, construction: 16.0, retail: 18.8, service: 44.1 },
  { year: 1991, total: 94.5, agriculture: 22.7, manufacturing: 5.1, construction: 15.4, retail: 19.2, service: 43.4 },
  { year: 1992, total: 95.6, agriculture: 24.4, manufacturing: 5.5, construction: 13.9, retail: 18.7, service: 42.1 },
  { year: 1993, total: 96.2, agriculture: 21.1, manufacturing: 5.3, construction: 13.2, retail: 19.8, service: 45.6 },
  { year: 1994, total: 96.4, agriculture: 18.5, manufacturing: 5.2, construction: 12.6, retail: 20.6, service: 46.9 },
  { year: 1995, total: 96.9, agriculture: 19.3, manufacturing: 4.9, construction: 12.7, retail: 21.3, service: 45.1 },
  { year: 1996, total: 96.6, agriculture: 16.6, manufacturing: 4.6, construction: 12.4, retail: 23.6, service: 46.3 },
  { year: 1997, total: 96.9, agriculture: 16.8, manufacturing: 4.7, construction: 12.3, retail: 22.9, service: 46.4 },
  { year: 1998, total: 96.9, agriculture: 16.3, manufacturing: 4.7, construction: 11.3, retail: 16.6, service: 51.3 },
  { year: 1999, total: 97.4, agriculture: 17.3, manufacturing: 5.2, construction: 10.9, retail: 19.0, service: 50.4 },
  { year: 2000, total: 97.2, agriculture: 16.0, manufacturing: 4.9, construction: 10.5, retail: 20.5, service: 51.0 },
  { year: 2001, total: 97.8, agriculture: 15.8, manufacturing: 4.9, construction: 10.5, retail: 20.2, service: 51.0 },
  { year: 2002, total: 98.9, agriculture: 15.0, manufacturing: 4.9, construction: 9.9, retail: 20.5, service: 50.8 },
  { year: 2003, total: 98.5, agriculture: 15.1, manufacturing: 5.3, construction: 10.8, retail: 20.7, service: 50.3 },
  { year: 2004, total: 98.9, agriculture: 12.9, manufacturing: 5.3, construction: 11.2, retail: 20.7, service: 51.1 },
  { year: 2005, total: 99.1, agriculture: 13.9, manufacturing: 5.5, construction: 9.9, retail: 19.9, service: 51.7 },
  { year: 2006, total: 99.3, agriculture: 12.4, manufacturing: 5.1, construction: 9.3, retail: 20.3, service: 53.6 },
  { year: 2007, total: 99.3, agriculture: 12.5, manufacturing: 5.4, construction: 8.8, retail: 20.5, service: 53.5 },
  { year: 2008, total: 99.6, agriculture: 13.1, manufacturing: 5.9, construction: 7.5, retail: 20.2, service: 53.7 },
  { year: 2009, total: 99.3, agriculture: 15.0, manufacturing: 5.7, construction: 7.7, retail: 19.5, service: 52.9 },
  { year: 2010, total: 99.6, agriculture: 13.9, manufacturing: 4.8, construction: 7.8, retail: 20.5, service: 53.3 },
  { year: 2011, total: 99.6, agriculture: 13.0, manufacturing: 4.9, construction: 8.4, retail: 20.3, service: 53.3 },
  { year: 2012, total: 99.4, agriculture: 12.5, manufacturing: 4.6, construction: 8.9, retail: 21.2, service: 53.4 },
  { year: 2013, total: 99.4, agriculture: 12.1, manufacturing: 4.6, construction: 9.1, retail: 20.9, service: 54.0 },
  { year: 2014, total: 99.6, agriculture: 10.8, manufacturing: 4.6, construction: 9.2, retail: 20.5, service: 55.3 },
  { year: 2015, total: 99.7, agriculture: 9.7, manufacturing: 4.9, construction: 9.9, retail: 20.5, service: 55.3 },
  { year: 2016, total: 99.4, agriculture: 10.0, manufacturing: 4.5, construction: 11.7, retail: 19.0, service: 53.5 },
  { year: 2017, total: 99.6, agriculture: 11.1, manufacturing: 5.0, construction: 12.3, retail: 19.0, service: 53.0 },
  { year: 2018, total: 99.9, agriculture: 9.6, manufacturing: 5.1, construction: 10.0, retail: 20.8, service: 54.6 },
  { year: 2019, total: 100.0, agriculture: 8.9, manufacturing: 4.8, construction: 9.0, retail: 20.7, service: 56.6 },
  { year: 2020, total: 100.0, agriculture: 9.6, manufacturing: 5.3, construction: 7.7, retail: 18.8, service: 58.7 },
  { year: 2021, total: 100.0, agriculture: 9.4, manufacturing: 5.4, construction: 6.2, retail: 18.8, service: 59.2 },
  { year: 2022, total: 99.8, agriculture: 9.5, manufacturing: 5.6, construction: 6.0, retail: 21.9, service: 57.2 },
  { year: 2023, total: 98.7, agriculture: 10.1, manufacturing: 6.5, construction: 6.8, retail: 21.6, service: 56.3 },
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

export default function IndustrialStructureChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={industrialData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
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
          strokeWidth={4} // 선 두께 증가
          dot={{ r: 3, strokeWidth: 2 }} // 점 크기 및 테두리 두께 증가
          activeDot={{ r: 6 }} // 활성화된 점 크기 증가
        />
        <Line type="monotone" dataKey="manufacturing" stroke={colorMap.manufacturing} name="manufacturing" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="construction" stroke={colorMap.construction} name="construction" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="retail" stroke={colorMap.retail} name="retail" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="service" stroke={colorMap.service} name="service" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
