import { Button, Typography, Layout } from "antd";
import { Link } from "@tanstack/react-router";
// import TopNavbar from "./TopNavbar";
const { Text, Title } = Typography;
const { Content } = Layout;

const NotFound = () => {
	return (
		<div className="flex flex-col">
			{/* <TopNavbar /> */}
			<Content className="mt-20" style={{ textAlign: "center" }}>
				<Title style={{ fontSize: "128px", fontWeight: "bold", lineHeight: 1, marginBottom: 16 }}>404</Title>
				<Text style={{ fontSize: "16px" }}>페이지가 존재하지 않습니다.</Text>
				<div className="flex justify-center">
					<Button type="primary" ghost style={{ marginTop: 16 }}>
						<Link to="/dashboard">돌아가기</Link>
					</Button>
				</div>
			</Content>
		</div>
	);
};

export default NotFound;
