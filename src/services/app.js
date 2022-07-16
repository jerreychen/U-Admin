import {get} from '/@/utils/request.js'

export const getVideoList = (data) => {
	return get('/', {
		s: 'Video.index',
		page: data.pageIndex
	})
}
