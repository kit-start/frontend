import React, { useState, useEffect } from "react"; 
import ProgressBar from "../../common/Progress/ProgressBar";
import { UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme, Input } from "antd";

const { Content, Sider } = Layout;

const ProjectEditPage = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { title: "Инициализация проекта" },
    { title: "" },
  ]);
  const [documentText, setDocumentText] = useState("");
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuProps["items"]>([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('src/components/pages/ProjectEditPage/menu.json'); 
        const data = await response.json();
        setMenuItems(data.items);
      } catch (error) {
        console.error("Ошибка при загрузке меню:", error);
      }
    };

    fetchMenuItems();
  }, []);

  const handleMenuClick = (key: string) => {
    const selectedItem = menuItems.flatMap(item => item.children).find(child => child.key === key);
    const title = selectedItem ? selectedItem.label : ""; 

    setIsEditorVisible(key === '3');
    setBreadcrumbItems([
      { title: "Инициализация проекта" },
      { title: title },
    ]);
  };

  return (
    <Layout>
      <ProgressBar />
      <Layout>
        <Sider width={300} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
            items={menuItems.map(item => ({
              ...item,
              children: item.children.map(child => ({
                ...child,
                onClick: () => handleMenuClick(child.key),
              })),
            }))}
          />
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Breadcrumb items={breadcrumbItems} style={{ margin: "16px 0" }} />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {isEditorVisible ? ( 
              <Input.TextArea
                value={documentText}
                onChange={(e) => setDocumentText(e.target.value)}
                rows={10}
                placeholder="Введите текст документа..."
              />
            ) : (
              <div>
                <h3>Выберите опцию из меню.</h3>
              </div>
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default ProjectEditPage;


