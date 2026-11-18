import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
// import { pathToFileURL } from 'node:url'

const brand = process.argv[2] || process.env.BRAND || 'demo'

const rootDir = process.cwd()
const brandDir = path.resolve(rootDir, 'brands', brand)

if (!fs.existsSync(brandDir)) {
  console.error(`\n❌ Brand "${brand}" tidak ditemukan di ${brandDir}!\n`)
  process.exit(1)
}

console.log(`\n🚀 [Brand Setup] Menyiapkan aset untuk "${brand}"...`)

// 1. Copy config -> src/config
const configSrc = path.resolve(brandDir, 'config')
const configDest = path.resolve(rootDir, 'src', 'config')
if (fs.existsSync(configSrc)) {
  fs.cpSync(configSrc, configDest, { recursive: true, force: true })
  console.log(`  ✔ Config disalin ke src/config/`)
}

// 2. Copy assets -> src/assets
const assetsSrc = path.resolve(brandDir, 'assets')
const assetsDest = path.resolve(rootDir, 'src', 'assets')
if (fs.existsSync(assetsSrc)) {
  fs.cpSync(assetsSrc, assetsDest, { recursive: true, force: true })
  console.log(`  ✔ Assets disalin ke src/assets/`)
}

// 3. Copy public -> public (icons, favicon, etc.)
const publicSrc = path.resolve(brandDir, 'public')
const publicDest = path.resolve(rootDir, 'public')
if (fs.existsSync(publicSrc)) {
  fs.cpSync(publicSrc, publicDest, { recursive: true, force: true })
  console.log(`  ✔ Public icons & favicon disalin ke public/`)
}

console.log(`✨ Sukses! Brand "${brand}" siap digunakan.\n`)
