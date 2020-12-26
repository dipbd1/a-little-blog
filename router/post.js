const express = require('express');
const Post = require('../models/post');
const router = new express.Router();
const auth = require('../middleware/auth');

//Route to create a Post
router.post('/posts', auth, async (req, res) => {
	if (req.user.type === 'blogger') {
		const post = new Post({
			...req.body,
			createdBy: req.user._id,
		});

		try {
			await post.save();
			res.status(201).send(post);
		} catch (e) {
			res.status(400).send(e);
		}
	} else {
		res.status(400).send({
			error: 'You are not a Blogger',
		});
	}
});

//Route to search for a single post
router.get('posts/:id', auth, async (req, res) => {
	const _id = req.params.id;
	try {
		// const post = await Post.findById(_id)
		const post = await Post.findOne({ _id });
		if (!post) {
			return res.status(404).send();
		}
		res.send(post);
	} catch (e) {
		if (e.name === 'CastError') {
			return res.status(404).send();
		}
		res.status(500).send(e);
	}
});

// Route to get all the posts without pagination
// It was better implement streams, but for now as it
// has only few posts, I am doing it in a basic way
router.get('/posts', auth, async (req, res) => {
	try {
		const posts = await Post.find();
		res.send(posts);
	} catch (e) {
		res.send(e);
	}
});

//Route to update a Post
router.patch('/posts/:id', auth, async (req, res) => {
	if (req.user.type === 'blogger') {
		const _id = req.params.id;
		const updates = Object.keys(req.body);
		const allowedUpdate = ['title', 'post'];
		const isAllowed = updates.every((update) => allowedUpdate.includes(update));

		if (!isAllowed) {
			res.status(400).send({
				error: 'invalid updates!',
			});
		}
		try {
			const post = await Post.findOne({ _id });
			if (!post) {
				res.status(404).send();
			}
			updates.forEach((update) => (post[update] = req.body[update]));
			await post.save();
			return res.send(post);
		} catch (e) {
			res.status(500).send(e);
		}
	} else {
		res.status(400).send({
			error: 'You are not a Blogger',
		});
	}
});

// Route to delete a post
router.delete('/posts/:id/image', auth, async (req, res) => {
	if (req.user.type === 'blogger') {
		const _id = req.params.id;
		try {
			const post = await Post.updateOne(_id, { bookImage: undefined });
			res.send('Image Deleted Succesfully');
		} catch (e) {
			res.send(e).status(400);
		}
	} else {
		res.status(400).send({
			error: 'You are not a Blogger',
		});
	}
});

// Route to add a comment
router.post('/posts/:id', auth, async (req, res) => {
	const _id = req.params.id;
	try {
		const post = await Post.updateOne(_id, {comment: req.body.comment});
		if(!post){
		res.status(400).send(e);
		}
		res.send(post);
	} catch(e) {
		res.status(400).send(e);
	}
});

// Route to upvote a post
router.patch('/posts/upvote/:id', async (req, res)=>{
	const _id = req.params.id;
	try {
		const post = await Post.updateOne(_id);
		if(!post){
			res.code(400).send("Post not found");
		}
		post.vote = post.vote+1;
		post.save();
		res.send("Post Updated with +1 vote");
	} catch (error) {
		res.code(400).send("Something went Wrong");
	}
})

//Route to downvote a posts
router.patch('/posts/downvote/:id', async (req, res)=>{
	const _id = req.params.id;
	try {
		const post = await Post.updateOne(_id);
		if(!post){
			res.code(400).send("Post not found");
		}
		post.vote = post.vote-1;
		post.save();
		res.send("Post Updated with +1 vote");
	} catch (error) {
		res.code(400).send("Something went Wrong");
	}
})

module.export = router;
