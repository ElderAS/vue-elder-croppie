import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faUndo } from '@fortawesome/free-solid-svg-icons/faUndo'

library.add(faPlus, faTimes, faPencilAlt, faUndo)
dom.watch()
