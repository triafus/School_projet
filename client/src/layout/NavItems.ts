interface NavItemProps {
  text: string;
  icon: React.ReactNode;
  path: string;
}

export const navigationItem = (props: NavItemProps) => {
  const { icon, text, path } = props;
  return [
    {
      text,
      icon,
      path,
      color: "#f093fb",
    },
  ];
};

type NavItem = {
  text: string;
  icon: JSX.Element;
  path: string;
  condition?: boolean;
};

export const MenuItems = (navItems: Array<NavItem>) => {
  const allItems = navItems;

  return allItems
    .filter((item) => item.condition !== false)
    .map((item) => navigationItem(item));
};
