import Control from './Control'
import Preview from './Preview'

if (typeof window !== 'undefined') {
    window.SliceControl = Control
    window.SlicePreview = Preview
}

export { Control as SliceControl, Preview as SlicePreview }