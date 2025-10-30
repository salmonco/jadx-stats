import { Input } from "antd";
import { UsersRound, Banknote, Fence, Tractor, Citrus, Sprout, Search, Salad, Handshake, Package } from "lucide-react";
import { useEffect, useState } from "react";
import JejuAgriBanner from "~/assets/data-banner.jpg";
import ReportList from "./ReportList";

const JejuAgricultureInData = ({ category }: { category: string }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

  useEffect(() => {
    if (category) {
      setSelectedCategory([category]);
    }
  }, [category]);

  const categories = [
    { value: "농가인구", Icon: UsersRound, size: 56 },
    { value: "농가경제", Icon: Banknote, size: 56 },
    { value: "경지이용", Icon: Fence, size: 56 },
    { value: "감귤", Icon: Citrus, size: 56 },
    { value: "생산요소", Icon: Package, size: 56 },
    { value: "농가경영", Icon: Handshake, size: 56 },
    { value: "농업생산", Icon: Tractor, size: 56 },
    { value: "토양", Icon: Sprout, size: 56 },
    { value: "식품", Icon: Salad, size: 56 },
  ];

  return (
    <div className="flex w-full flex-col items-center overflow-y-auto">
      <div className="relative min-h-[350px] w-full bg-cover bg-center" style={{ backgroundImage: `url(${JejuAgriBanner})` }}>
        <div className="flex h-full flex-col items-center justify-center text-white">
          <h1 className="mb-7 text-4xl font-bold">데이터로 본 제주 농업</h1>
          <div className="w-full max-w-xl px-4">
            <Input
              suffix={<Search width={24} height={24} strokeWidth={1.5} color="#b9b9b9" />}
              placeholder="데이터를 검색해 보세요."
              className="w-full rounded-xl border-none px-5 py-3 text-lg text-[#222] placeholder:text-base"
              onChange={(e) => setInputValue(e.target.value)}
              onPressEnter={() => setSearchValue(inputValue)}
            />
          </div>
          <div className="mt-7 flex w-full max-w-[1000px] items-center justify-between gap-4">
            {categories.map(({ value, Icon, size }) => (
              <div
                key={value}
                className={`flex w-full cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-transparent py-2.5 transition-all duration-200 hover:border-[#f1f1f1] ${selectedCategory.includes(value) ? "bg-[#f1f1f1] font-semibold text-[#222]" : ""}`}
                onClick={() => {
                  if (selectedCategory.includes(value)) {
                    setSelectedCategory(selectedCategory.filter((category) => category !== value));
                  } else {
                    setSelectedCategory([...selectedCategory, value]);
                  }
                }}
              >
                <Icon width={size} height={size} strokeWidth={1.5} />
                <span className="text-xl">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-full min-h-[750px] w-full max-w-[1200px] px-16 py-12 2xl:max-w-[1300px] 3xl:max-w-[1500px] 4xl:max-w-[1800px]">
        <ReportList searchValue={searchValue} selectedCategory={selectedCategory} />
      </div>
    </div>
  );
};

export default JejuAgricultureInData;
