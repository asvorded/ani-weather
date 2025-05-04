export enum PagesNames {
  Home = 'Home',
  TownSelect = 'TownSelect',
  Settings = 'Settings',
  MeteoChannel = 'MeteoChannel'
}

export type RootStackParamsList = {
  [PagesNames.Home]: undefined,
  [PagesNames.TownSelect]: undefined,
  [PagesNames.MeteoChannel]: undefined
  [PagesNames.Settings]: undefined;
};
