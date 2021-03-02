import{CatMap, StatusMap} from '../constants/export_task'

export const exportTaskCat = value => {
  return CatMap[value]
}

export const exportTaskStatus = status => {
  return StatusMap[status]
}
