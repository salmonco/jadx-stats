import { useEffect, useRef, useState } from "react";
import { MenuProps } from "antd";
import { AppstoreOutlined, MailOutlined, PieChartOutlined, DesktopOutlined, ContainerOutlined } from "@ant-design/icons";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
    { key: "1", icon: <PieChartOutlined />, label: "메뉴 1" },
    { key: "2", icon: <DesktopOutlined />, label: "메뉴 2" },
    { key: "3", icon: <ContainerOutlined />, label: "메뉴 3" },
    {
        key: "sub1",
        label: "카테고리 1",
        icon: <MailOutlined />,
        children: [
            { key: "5", label: "메뉴 5" },
            { key: "6", label: "메뉴 6" },
            { key: "7", label: "메뉴 7" },
            { key: "8", label: "메뉴 8" },
        ],
    },
    {
        key: "sub2",
        label: "카테고리 2",
        icon: <AppstoreOutlined />,
        children: [
            { key: "9", label: "메뉴 9" },
            { key: "10", label: "메뉴 10" },
            {
                key: "sub3",
                label: "서브카테고리 2-1",
                children: [
                    { key: "11", label: "메뉴 11" },
                    { key: "12", label: "메뉴 12" },
                ],
            },
        ],
    },
];

interface FloatingMenuProps {
    text?: string;
    position: { x: number; y: number };
    onClose: () => void;
    menuChildren?: React.ReactNode;
}

const FloatingMenu = ({ text = null, position, onClose, menuChildren = <></> }: FloatingMenuProps) => {
    const menuRef = useRef(null);
    const [menuItems, setMenuItems] = useState<MenuItem[]>(items);

    useEffect(() => {
        const newItems = menuItems;
        // @ts-ignore
        newItems[0].label = text;
        setMenuItems(newItems);
    }, [text]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div
            ref={menuRef}
            style={{
                position: "absolute",
                top: position.y,
                left: position.x,
                zIndex: 10,
                background: "#3D4C6E",
                color: "white",
                // border: "1px solid #ccc",
                padding: "18px",
                // padding: "10px",
                borderRadius: "6px",
            }}
        >
            {text && <p>{text}</p>}
            {menuChildren}
        </div>
    );
};

export default FloatingMenu;
