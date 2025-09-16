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
