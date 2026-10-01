export type ReferenceMedia = { src: string; alt: string; credit: string; source: string; title: string; original: string }

export const buildingMedia = {
  globe: { src: '/reference/buildings/globe.jpg', alt: '科学与创新环球馆外观夜景', title: '环球馆 · 建筑外观', credit: '© CERN', source: 'https://sciencegateway.cern/globe', original: 'https://sciencegateway.cern/sites/default/files/2023-09/globe-at-night.jpg' },
  ideasquare: { src: '/reference/buildings/ideasquare.jpg', alt: 'IdeaSquare 室内工作坊与红色巴士', title: 'IdeaSquare · 室内空间', credit: '© CERN', source: 'https://sciencegateway.cern/ideasquare', original: 'https://sciencegateway.cern/sites/default/files/2023-10/ideasquare.jpg' },
  synchrocyclotron: { src: '/reference/buildings/synchrocyclotron.jpg', alt: '同步回旋加速器馆内的加速器展陈', title: '同步回旋加速器馆 · 室内展陈', credit: '© CERN', source: 'https://visit.cern/sc', original: 'https://visit.cern/sites/default/files/inline-images/synchroclotron.jpg' },
} satisfies Record<string, ReferenceMedia>

export const cernMedia = [
  { src: '/reference/gateway.jpg', alt: 'CERN Science Gateway 与环球馆夜景', credit: '© CERN', source: 'https://sciencegateway.cern/', title: 'CERN Science Gateway', original: 'https://sciencegateway.cern/sites/default/files/2025-06/cern-science-gateway-at-night_0.jpg' },
  { src: '/reference/atlas.jpg', alt: '2007 年 7 月的 ATLAS 探测器', credit: 'Claudia Marcelloni / © CERN', source: 'https://cds.cern.ch/images/CERN-EX-0706038-02', title: 'ATLAS 探测器', original: 'https://cds.cern.ch/images/CERN-EX-0706038-02/file?size=large' },
  { src: '/reference/accelerator.jpg', alt: 'CERN 隧道内部的现实参考照片', credit: '© CERN', source: 'https://home.cern/', title: 'CERN 隧道', original: 'https://home.cern/wp-content/uploads/2026/05/202105-067_050.jpg' },
  { src: '/reference/exhibition.jpg', alt: 'CERN Science Gateway 科学演示活动', credit: '© CERN', source: 'https://sciencegateway.cern/', title: '科学演示', original: 'https://sciencegateway.cern/sites/default/files/2023-11/mysteries_of_matter_2.jpg' },
] as const

export const features = [
  { title: '在 Minecraft 中\n探索 CERN 园区', category: '园区还原', description: '建筑还原与园区导览。专题介绍待补充。', to: '/campus', action: '探索园区', media: cernMedia[0] },
  { title: '从现实设施\n到方块世界', category: '建筑档案', description: '现实参考、建筑资料与还原记录待补充。', to: '/campus/building-b', action: '查看建筑档案', media: buildingMedia.ideasquare },
  { title: '沿着设施\n了解 CERN', category: '参观指南', description: 'Minecraft 参观路线与开放安排待公布。', to: '/visit', action: '查看参观指南', media: cernMedia[2] },
  { title: '在游戏中\n走近粒子物理', category: '科教展馆', description: '展馆主题与游戏内科教体验待补充。', to: '/exhibition', action: '参观科教展馆', media: cernMedia[3] },
] as const
