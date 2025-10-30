import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useAuth } from "~/contexts/AuthContext";
import { Button, Form, Input, message, Card } from "antd";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      setLoading(true);
      await login(values.username, values.password);
      router.navigate({ to: "/" });
    } catch (e: any) {
      messageApi.error(e.response?.data?.detail ?? "로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f5f6fa] p-4">
      <Card className="w-full max-w-[400px] shadow-md" style={{ borderRadius: 16 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="아이디" name="username">
            <Input autoFocus />
          </Form.Item>
          <Form.Item label="비밀번호" name="password">
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            로그인
          </Button>
        </Form>
      </Card>

      {contextHolder}
    </div>
  );
}
