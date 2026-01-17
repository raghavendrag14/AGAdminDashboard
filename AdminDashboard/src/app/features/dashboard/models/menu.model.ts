
export interface Menu{
  name: string;
  // `link` is the route/path or URL (backend field name)
  link?: string;
  // recursive submenu items
  submenu?: Menu[];
}

export interface MenuResponse{
    menuDetails: Menu[];
}