import {
  Home,
  ShoppingCart,
  CreditCard,
  Users,
  Settings,
  MessageSquare,
  Headphones,
  BarChart,
  LogOut,
  Package,
  Wallet,
  RefreshCw,
  Menu,
  Cog,
  Store,
} from "lucide-react";

export const menuItems = [
  { icon: Home, label: "Accueil", path: "/home" },
  {
    icon: Menu,
    label: "Menu Admin",
    path: "#",
    submenu: [
      { icon: Settings, label: "Réglages", path: "/settings" },
      { icon: Cog, label: "Configuration", path: "/configuration" },
    ]
  },
  { icon: Package, label: "Produit", path: "/blog" },
  { icon: ShoppingCart, label: "Commandes", path: "/orders" },
  { icon: CreditCard, label: "Transaction", path: "/transaction" },
  { icon: Users, label: "Clients", path: "/clients" },
  { icon: Wallet, label: "Retraits", path: "/withdrawals" },
  { icon: RefreshCw, label: "Remboursements", path: "/refunds" },
  { icon: Headphones, label: "Support", path: "/support" },
];

export const logoutMenuItem = {
  icon: LogOut,
  label: "Déconnexion",
  path: "/logout",
};