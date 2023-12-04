import { getApps, initializeApp } from 'firebase-admin/app';
import { hasPath, head } from 'ramda';

import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import service_acount from './service_account';

const apps = getApps();

if (!apps.length) {
	initializeApp({
		credential: admin.credential.cert(service_acount)
	});
}

const auth = getAuth();
const firestore = getFirestore();

const updateUser = async (uid, data) => {
	await firestore.collection('users').doc(uid).set(data, { merge: true });
};

const getUserData = async (uid) => {
	const user = await firestore
		.collection('users')
		.doc(uid)
		.get()
		.then((doc) => doc.data());
	return user;
};

const deleteUser = async (uid) => {
	await auth.deleteUser(uid);
	return firestore.collection('users').doc(uid).delete();
};

const getUserByUID = async (uid) => {
	try {
		const user = await firestore
			.collection('users')
			.doc(uid)
			.get()
			.then((doc) => {
				if (doc.exists) {
					return doc.data();
				}
				return null;
			});
		return user;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const getUsersByEmail = async (email) => {
	try {
		const querySnapshot = await firestore.collection('users').where('email', '==', email).get();
		console.log(querySnapshot.size);
		let users = [];
		querySnapshot.forEach((doc) => {
			users.push({ ...doc.data(), uid: doc.id });
		});
		return users;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const saveBlog = (data) => {
	return firestore.collection('blogs').add(data);
};

const deleteBlog = (id) => {
	return firestore.collection('blogs').doc(id).delete();
};

const editBlog = (id, data) => {
	return firestore.collection('blogs').doc(id).set(data, { merge: true });
};

const getBlogByID = (id) => {
	return firestore.collection('blogs').doc(id).get();
};

const getBlogs = async () => {
	const blogsRef = firestore.collection('blogs');
	const blogs = await blogsRef
		.get()
		.then((snapshot) => snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
		.catch((err) => {
			console.log(err);
			return [];
		});

	return blogs;
};

const getUsers = async () => {
	const usersRef = firestore.collection('users');
	const users = await usersRef
		.get()
		.then((snapshot) => snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
		.catch((err) => {
			console.log(err);
			return [];
		});

	return users;
};

const saveAnnouncement = (data) => {
	return firestore.collection('announcements').add(data);
};

const deleteAnnouncement = (id) => {
	return firestore.collection('announcements').doc(id).delete();
};

const editAnnouncement = (id, data) => {
	return firestore.collection('announcements').doc(id).set(data, { merge: true });
};

const getAnnouncements = async () => {
	const announcementsRef = firestore.collection('announcements');
	const announcements = await announcementsRef
		.get()
		.then((snapshot) => snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
		.catch((err) => {
			console.log(err);
			return [];
		});

	return announcements;
};

const getAllIPAddresses = async () => {
	const ipAddressesRef = firestore.collection('ipAddresses');
	const ipAddresses = await ipAddressesRef
		.get()
		.then((snapshot) => snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
		.catch((err) => {
			console.log(err);
			return [];
		});

	return ipAddresses;
};

const switchIPAddresses = async (id, rest) => {
	const ipAddressesRef = firestore.collection('ipAddresses');
	await ipAddressesRef.doc(id).set(rest, { merge: true });
};

const revokeUserToken = async (uid) => {
	await auth.revokeRefreshTokens(uid);
};

// get all reports
const getReports = async () => {
	const usersRef = firestore.collection('reports');
	const users = await usersRef
		.get()
		.then((snapshot) => snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
		.catch((err) => {
			console.log(err);
			return [];
		});

	return users;
};

// delet report
const deletReports = (id) => {
	return firestore.collection('reports').doc(id).delete();
};

export {
	getBlogs,
	saveBlog,
	deleteBlog,
	getBlogByID,
	editBlog,
	getUsers,
	getUserByUID,
	updateUser,
	saveAnnouncement,
	deleteAnnouncement,
	editAnnouncement,
	getAnnouncements,
	getReports,
	deletReports,
	deleteUser,
	revokeUserToken,
	getAllIPAddresses,
	switchIPAddresses,
	getUserData
};
