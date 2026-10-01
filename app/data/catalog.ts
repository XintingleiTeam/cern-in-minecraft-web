import { buildingMedia } from './media'

// WGS84 positions from MapCERN; C4 image extent is documented in public/maps/SOURCES.md.
function mapPosition(longitude: number, latitude: number) {
  const x = 6378137 * longitude * Math.PI / 180
  const y = 6378137 * Math.log(Math.tan(Math.PI / 4 + latitude * Math.PI / 360))
  return { x: (x - 673561.5931097161) / 800 * 100, y: (5818263.134806459 - y) / 800 * 100 }
}

export const buildings = [
  { slug: 'building-a', name: '科学与创新环球馆', marker: 'A', number: '80', longitude: 6.055590885629, latitude: 46.233822937967, media: buildingMedia.globe, description: '木结构球形建筑，用于展览、会议与公众活动。', source: 'https://sciencegateway.cern/globe' },
  { slug: 'building-b', name: 'IdeaSquare', marker: 'B', number: '3179', longitude: 6.054978678054, latitude: 46.234650317849, media: buildingMedia.ideasquare, description: 'CERN 的创新空间，开展原型制作、设计工作坊与跨学科协作。', source: 'https://ideasquare.cern/about' },
  { slug: 'building-c', name: '同步回旋加速器馆', marker: 'C', number: '300', longitude: 6.052627151069, latitude: 46.233037007844, media: buildingMedia.synchrocyclotron, description: 'CERN 第一台加速器的所在地，通过展陈介绍设施与研究历史。', source: 'https://visit.cern/sc' },
].map(building => ({ ...building, ...mapPosition(building.longitude, building.latitude) }))

export const exhibits = [
  { slug: 'exhibit-a', name: '展区 A' },
  { slug: 'exhibit-b', name: '展区 B' },
  { slug: 'exhibit-c', name: '展区 C' },
] as const
