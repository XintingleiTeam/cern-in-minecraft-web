import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'

const root = path.resolve(import.meta.dirname, '..')
const baseURL = process.env.NUXT_APP_BASE_URL || '/'
const routes = ['/', '/about', '/campus', '/exhibition', '/visit', ...['a', 'b', 'c'].flatMap(letter => [`/campus/building-${letter}`, `/exhibition/exhibit-${letter}`])]
for (const route of routes) {
  const html = fs.readFileSync(path.join(root, '.output/public', route, 'index.html'), 'utf8')
  for (const [, asset] of html.matchAll(/(?:src|href)="(\/[^"]*)"/g)) {
    assert.ok(asset.startsWith(baseURL), `Asset or link outside deployment base: ${asset}`)
  }
  assert.match(html, /lang="zh-CN"/, route)
  assert.match(html, /<h1[\s>]/, route)
  assert.match(html, /待补充|待公布/, route)
  assert.doesNotMatch(html, /id="(?:open-game|fire-beam|check-path)"/, route)
}
console.log(`PASS: ${routes.length} prerendered Chinese pages; content placeholders; no mini-game.`)
if (!process.argv.includes('--browser')) process.exit(0)

const origin = process.env.DEMO_URL || 'http://127.0.0.1:3000'
const target = await (await fetch('http://127.0.0.1:9222/json/new?about:blank', { method: 'PUT' })).json()
const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject })
let id = 0
const pending = new Map()
const errors = []
ws.onmessage = event => {
  const message = JSON.parse(event.data)
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text)
  if (message.method === 'Runtime.consoleAPICalled' && ['warning', 'error'].includes(message.params.type)) {
    const text = message.params.args.map(arg => arg.value || arg.description || '').join(' ')
    if (/hydration|mismatch|error/i.test(text)) errors.push(text)
  }
  if (message.id) { const job = pending.get(message.id); pending.delete(message.id); message.error ? job.reject(new Error(message.error.message)) : job.resolve(message.result) }
}
const send = (method, params = {}) => new Promise((resolve, reject) => { pending.set(++id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })) })
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text)
  return result.result.value
}
async function until(expression) {
  for (let i = 0; i < 100; i++) { if (await evaluate(expression)) return; await delay(100) }
  throw new Error(`Timed out: ${expression}`)
}
async function visit(route) {
  await send('Page.navigate', { url: origin + route })
  await until(`location.pathname === ${JSON.stringify(route)} && !!document.querySelector('#__nuxt main h1')`)
  await until(`!!document.querySelector('#__nuxt').__vue_app__`)
  await delay(100)
}
async function click(selector) {
  const point = await evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); el.scrollIntoView({block:'center',behavior:'instant'}); const r = el.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2}; })()`)
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', clickCount: 1 })
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', clickCount: 1 })
}
async function screenshot(name, full = false) {
  if (process.env.CHECK_SCREENSHOTS === '0') return
  await evaluate('document.activeElement.blur(); window.scrollTo({top:0,behavior:"instant"})')
  await delay(150)
  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: full })
  fs.mkdirSync(path.join(root, '.preview'), { recursive: true })
  fs.writeFileSync(path.join(root, '.preview', name), Buffer.from(shot.data, 'base64'))
}
try {
  await send('Runtime.enable'); await send('Page.enable')
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })
  await visit('/')
  assert.equal(await evaluate(`getComputedStyle(document.body).color`), 'rgb(248, 250, 252)')
  assert.equal(await evaluate(`document.querySelector('link[rel="icon"]').getAttribute('href')`), '/favicon.ico')
  assert.deepEqual(Buffer.from(await (await fetch(origin + '/favicon.ico')).arrayBuffer()), fs.readFileSync(path.join(root, 'public/favicon.ico')))
  assert.equal(await evaluate(`(() => { const b=document.querySelector('.carousel-next').getBoundingClientRect(), s=document.querySelector('.carousel-next svg').getBoundingClientRect(); return b.width>=76 && s.width>=36 && Math.abs(b.x+b.width/2-s.x-s.width/2)<1 && Math.abs(b.y+b.height/2-s.y-s.height/2)<1 })()`), true)
  await click('[data-nav="/campus"]')
  await until(`!!document.querySelector('#desktop-menu')`)
  await screenshot('cern-desktop-menu.png')
  await evaluate(`document.querySelector('#nav-trigger-1').focus()`)
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
  assert.equal(await evaluate(`document.activeElement.id`), 'nav-trigger-1')
  assert.equal(await evaluate(`!!document.querySelector('#desktop-menu')`), false)
  await click('[data-view="real"]')
  await until(`document.querySelector('[data-view="real"]').getAttribute('aria-pressed') === 'true'`)
  assert.match(await evaluate(`document.querySelector('.comparison').textContent`), /临时参考/)
  await until(`document.querySelector('.comparison-photo').complete && document.querySelector('.comparison-photo').naturalWidth > 0`)
  await click('[data-view="minecraft"]')
  await until(`document.querySelector('.comparison').textContent.includes('游戏实景待补充')`)
  await click('[data-view="real"]')
  await screenshot('nuxt-home.png', true)
  await screenshot('nuxt-first-screen.png')
  await click('[data-nav="/campus"]')
  await click('#desktop-menu .mega-overview')
  await until(`location.pathname === '/campus' && !!document.querySelector('#open-map')`)
  await click('#open-map')
  assert.equal(await evaluate(`document.querySelector('#map-dialog').open`), true)
  await click('[data-place="building-b"]')
  await until(`document.querySelector('#selected-name').textContent === '建筑 B'`)
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
  assert.equal(await evaluate(`document.querySelector('#map-dialog').open`), false)
  assert.equal(await evaluate(`document.activeElement.id`), 'open-map')
  await click('#open-map')
  await click('#place-detail')
  await until(`location.pathname === '/campus/building-b' && document.querySelector('h1')?.textContent === '建筑 B'`)
  await click('[data-view="real"]')
  await until(`document.querySelector('[data-view="real"]').getAttribute('aria-pressed') === 'true'`)
  await screenshot('nuxt-building.png', true)
  await send('Page.reload')
  await until(`document.querySelector('h1')?.textContent === '建筑 B'`)
  await visit('/exhibition/exhibit-c')
  assert.equal(await evaluate(`document.querySelector('h1').textContent`), '展区 C')
  await visit('/exhibition')
  assert.match(await evaluate(`document.querySelector('#lab').textContent`), /互动内容待补充/)
  assert.equal(await evaluate(`!!document.querySelector('#open-game')`), false)
  for (const width of [1440, 768, 390, 320]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: width < 760 })
    for (const route of ['/', '/campus', '/campus/building-a', '/exhibition', '/exhibition/exhibit-a', '/about', '/visit']) {
      await visit(route)
      assert.equal(await evaluate(`document.documentElement.scrollWidth <= innerWidth`), true, `${route} at ${width}px`)
    }
    if (width === 390) {
      await visit('/')
      assert.equal(await evaluate(`(() => { const b=document.querySelector('.carousel-next').getBoundingClientRect(),s=document.querySelector('.carousel-next svg').getBoundingClientRect(); return b.width>=60 && s.width>=32 && Math.abs(b.x+b.width/2-s.x-s.width/2)<1 && Math.abs(b.y+b.height/2-s.y-s.height/2)<1 })()`), true)
      await screenshot('nuxt-mobile.png', true)
      await click('#open-menu')
      await until(`document.querySelector('#mobile-menu').open`)
      assert.equal(await evaluate(`document.querySelector('#open-menu').getAttribute('aria-expanded')`), 'true')
      await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
      await until(`!document.querySelector('#mobile-menu').open`)
      assert.equal(await evaluate(`document.activeElement.id`), 'open-menu')
      await click('#open-menu')
      await click('#mobile-menu [data-menu="/campus"] summary')
      await click('#mobile-menu a[href="/campus"]')
      await until(`location.pathname === '/campus' && !document.querySelector('#mobile-menu').open`)
      assert.equal(await evaluate(`document.querySelector('#open-menu').getAttribute('aria-expanded')`), 'false')
    }
  }
  await visit('/campus')
  await click('#open-map')
  assert.equal(await evaluate(`document.querySelector('#map-dialog').getBoundingClientRect().right <= innerWidth`), true)
  await click('[data-place="building-c"]')
  await until(`document.querySelector('#selected-name').textContent === '建筑 C'`)
  await click('.close-dialog')
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })
  await visit('/')
  await until(`getComputedStyle(document.querySelector('.page-transition-overlay')).visibility === 'hidden'`)
  assert.equal(await evaluate(`document.querySelectorAll('.pt-block').length > 20`), true)
  await until(`document.querySelector('.slide img').complete && document.querySelector('.slide img').naturalWidth > 0`)
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 10, y: 10 })
  await until(`document.querySelector('#slide-number').textContent.includes('2 / 4')`)
  await click('[data-playback]')
  assert.equal(await evaluate(`document.querySelector('[data-playback]').getAttribute('aria-label')`), '播放轮播')
  const pausedSlide = await evaluate(`document.querySelector('#slide-number').textContent`)
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 10, y: 10 })
  await delay(6800)
  assert.equal(await evaluate(`document.querySelector('#slide-number').textContent`), pausedSlide)
  await click('.carousel-prev')
  await delay(600)
  await click('.carousel-next')
  await until(`document.querySelector('#slide-number').textContent.includes('2 / 4')`)
  await delay(600)
  await click('.carousel-prev')
  await until(`document.querySelector('#slide-number').textContent.includes('1 / 4')`)
  await delay(600)
  await evaluate(`document.querySelectorAll('.reveal-up,.mask-reveal-el').forEach(el => el.scrollIntoView({behavior:'instant'}))`)
  await evaluate(`window.scrollTo({top:0,behavior:'instant'})`)
  await delay(1000)
  await screenshot('xintinglei-motion-home.png')
  await click('[data-nav="/campus"]')
  await click('#desktop-menu .mega-overview')
  await until(`getComputedStyle(document.querySelector('.page-transition-overlay')).visibility === 'visible'`)
  await until(`location.pathname === '/campus' && !!document.querySelector('#open-map')`)
  await until(`getComputedStyle(document.querySelector('.page-transition-overlay')).visibility === 'hidden'`)
  await evaluate(`document.querySelector('.building-card').scrollIntoView({block:'center',behavior:'instant'})`)
  await until(`document.querySelector('.building-card').classList.contains('in')`)
  const hoverPoint = await evaluate(`(() => { const r = document.querySelector('.building-card').getBoundingClientRect(); return {x:r.left+35,y:r.top+35} })()`)
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...hoverPoint })
  await until(`document.querySelector('.building-card').style.transform.includes('perspective')`)
  await click('.motion-toggle')
  await until(`document.documentElement.classList.contains('motion-paused')`)
  await click('.motion-toggle')
  await until(`!document.documentElement.classList.contains('motion-paused')`)
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
  await click('#open-menu')
  await click('#mobile-menu [data-menu="/campus"] summary')
  assert.equal(await evaluate(`getComputedStyle(document.querySelector('#mobile-menu')).backgroundColor`), 'rgb(8, 8, 10)')
  await screenshot('cern-menu-xintinglei-colors.png')
  await click('#mobile-menu [data-menu="/exhibition"] summary')
  assert.equal(await evaluate(`document.querySelectorAll('#mobile-menu details[open]').length`), 1)
  await click('#mobile-menu a[href="/exhibition#lab"]')
  await until(`location.pathname === '/exhibition' && location.hash === '#lab' && !document.querySelector('#mobile-menu').open`)
  await until(`getComputedStyle(document.querySelector('.page-transition-overlay')).visibility === 'hidden'`)
  await visit('/')
  await until(`getComputedStyle(document.querySelector('.page-transition-overlay')).visibility === 'hidden'`)
  await evaluate(`(() => { const el = document.querySelector('.hero-section'); el.dispatchEvent(new TouchEvent('touchstart', {touches:[new Touch({identifier:1,target:el,clientX:300,clientY:300})]})); el.dispatchEvent(new TouchEvent('touchend', {changedTouches:[new Touch({identifier:1,target:el,clientX:100,clientY:300})]})); })()`)
  await until(`document.querySelector('#slide-number').textContent.includes('2 / 4')`)
  assert.equal((await fetch(origin + '/campus/does-not-exist')).status, 404)
  await evaluate(`document.querySelector('.exhibition-layout').scrollIntoView({behavior:'instant',block:'center'})`)
  await until(`document.querySelector('.exhibition-layout img').complete && document.querySelector('.exhibition-layout img').naturalWidth > 0`)
  await send('Emulation.setDeviceMetricsOverride', { width: 900, height: 400, deviceScaleFactor: 1, mobile: false })
  await click('[data-nav="/exhibition"]')
  assert.equal(await evaluate(`document.querySelector('#desktop-menu').getBoundingClientRect().bottom <= innerHeight`), true)
  await click('[data-nav="/campus"]')
  await click('#desktop-menu .mega-overview')
  await until(`getComputedStyle(document.querySelector('.page-transition-overlay')).visibility === 'visible'`)
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await until(`location.pathname === '/campus' && !!document.querySelector('#open-map') && getComputedStyle(document.querySelector('.page-transition-overlay')).visibility === 'hidden'`)
  assert.equal((await fetch(origin + '/exhibition/does-not-exist')).status, 404)
  assert.deepEqual(errors, [])
  console.log('PASS: navigation, comparison, map, 4 viewports, CERN accordion menu, carousel autoplay/pause/swipe, tile transitions, card tilt, reduced motion, no hydration or script errors.')
} catch (error) {
  console.error('Browser errors:', errors)
  console.error('Overflow:', await evaluate(`Array.from(document.querySelectorAll('body *')).filter(e => e.getBoundingClientRect().right > innerWidth + 1).map(e => ({tag:e.tagName,cls:e.className,right:e.getBoundingClientRect().right,text:e.textContent.slice(0,60)})).slice(0,15)`))
  await screenshot('check-failure.png')
  throw error
} finally {
  ws.close()
  await fetch(`http://127.0.0.1:9222/json/close/${target.id}`)
}
