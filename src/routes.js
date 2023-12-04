import { prop } from 'ramda';

export default {
	blogs: () => '/blogs',
	addBlog: () => `/blogs/add`,
	editBlog: (id) => `/blogs/${id}`,
	users: () => '/users',
	editUser: (id) => `/users/edit/${id}`,
	announcements: () => '/announcements',
	reports: () => '/reports',

	api: {
		getBlogs: () =>
			fetch('/api/blogs/get', {
				method: 'GET'
			})
				.then((res) => res.json())
				.then(prop('blogs')),
		deleteBlog: (id) =>
			fetch('/api/blogs/delete', {
				method: 'POST',
				body: JSON.stringify({ id }),
				headers: {
					'content-type': 'application/json'
				}
			}),
		editBlog: (data) =>
			fetch('/api/blogs/edit', {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'content-type': 'application/json'
				}
			}),
		addBlog: (data) =>
			fetch('/api/blogs/add', {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'content-type': 'application/json'
				}
			}),
		//
		getUsers: () =>
			fetch('/api/users/get', {
				method: 'GET'
			})
				.then((res) => res.json())
				.then(prop('users')),
		editUser: (data) =>
			fetch('/api/users/edit', {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'content-type': 'application/json'
				}
			}),
		deleteUser: (id) =>
			fetch('/api/users/delete', {
				method: 'POST',
				body: JSON.stringify({ id }),
				headers: {
					'content-type': 'application/json'
				}
			}),
		revokeToken: (id) =>
			fetch('/api/users/revokeToken', {
				method: 'POST',
				body: JSON.stringify({ id }),
				headers: {
					'content-type': 'application/json'
				}
			}),
		switchIPAddresses: (data) =>
			fetch('/api/users/switchIPAddresses', {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'content-type': 'application/json'
				}
			}),
		//
		getAnnouncements: () =>
			fetch('/api/announcements/get', {
				method: 'GET'
			})
				.then((res) => res.json())
				.then(prop('announcements')),
		editAnnouncement: (data) =>
			fetch('/api/announcements/edit', {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'content-type': 'application/json'
				}
			}),
		addAnnouncement: (data) =>
			fetch('/api/announcements/add', {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'content-type': 'application/json'
				}
			}),
		deleteAnnouncement: (id) =>
			fetch('/api/announcements/delete', {
				method: 'POST',
				body: JSON.stringify({ id }),
				headers: {
					'content-type': 'application/json'
				}
			}),
		//
		getReports: () =>
			fetch('/api/reports/get', {
				method: 'GET'
			})
				.then((res) => res.json())
				.then(prop('reports')),
		//
		cancelSubscription: (id) =>
			fetch('/api/stripe/cancelSubscription', {
				method: 'POST',
				body: JSON.stringify({ id })
			})
				.then((res) => res.json())
				.then(prop('reports')),
		getAllCanceledSubscriptions: () =>
			fetch('/api/stripe/getCanceledSubscriptions', {
				method: 'GET'
			})
				.then((res) => res.json())
				.then(prop('subscriptions'))
	}
};
