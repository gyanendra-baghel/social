import { User } from "../models/user.model.js"

const getFriends = async (req, res) => {
    const userID = req.user.id;
    try {
        const friends = await User.findById(userID).populate("friends", 'username fullName');
        res.status(200).json(friends);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error." });
    }
}

const addFriend = async (req, res) => {
    const user = req.user;
    const { username } = req.body;

    const friendUsername = username;

    if (!friendUsername) {
        return res.status(204).json({ message: "friend username is required!" })
    }

    try {
        // Check if the contact user exists
        const friend = await User.findOne({ username: friendUsername });
        if (!friend) {
            return res.status(404).json({ message: 'Friend not found' });
        }

        // Update user's friends list
        await User.findByIdAndUpdate(user.id, { $addToSet: { friends: friend.id } });
        await User.findByIdAndUpdate(friend.id, { $addToSet: { friends: user.id } })

        res.status(201).json({ message: 'Friend added successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

const addPendingFriend = async (req, res) => {
    const user = req.user;
    const { username } = req.body;

    const friendUsername = username;

    try {
        // Check if the contact user exists
        const friend = await User.findOne({ username: friendUsername });
        if (!friend) {
            return res.status(404).json({ message: 'Friend not found' });
        }

        // already have friend request to you then make friends
        if (user.pendingFriends.includes(friend._id)) {
            if (!user.friends.includes(friend._id)) user.friends.push(friend._id);
            if (!friend.friends.includes(user._id)) friend.friends.push(user._id);
            // remove pending request
            user.pendingFriends.pop(friend._id);
            await user.save();
            await friend.save();
            return res.status(201).json({ friend: true, message: 'Friend added successfully' });
        }
        // Add friend requests to friend & me  if not friend
        if (!user.friends.includes(friend._id)) {
            if (!friend.pendingFriends.includes(user._id)) friend.pendingFriends.push(user._id);
            if (!user.pendingRequests.includes(friend._id)) user.pendingRequests.push(friend._id);
            await user.save();
            await friend.save();
            return res.status(201).json({ message: 'Friend Request added successfully' });
        }
        return res.status(200).json({ friend: true, message: 'Already Friends.' });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}

const pendingFriends = async (req, res) => {
    const userID = req.user.id;
    try {
        const friends = await User.findById(userID).populate("pendingFriends", 'username fullName');
        res.status(200).json(friends);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error." });
    }
}

const removeFriend = async (req, res) => {
    const user = req.user;
    const { username } = req.body;

    const friendUsername = username;

    if (!friendUsername) {
        return res.status(404).json({ message: "friend username is required!" })
    }

    try {
        // Check if the contact user exists
        const friend = await User.findOne({ username: friendUsername });
        if (!friend) {
            return res.status(404).json({ message: 'friend not found' });
        }
        // Update user's friends list
        if (friend.friends.includes(user._id)) friend.friends.pop(user._id);
        if (user.friends.includes(friend._id)) user.friends.pop(friend._id);

        await user.save();
        await friend.save();

        res.json({ message: 'Friend removed successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

const recommendFriends = async (req, res) => {
    const userID = req.user.id;

    try {
        const user = await User.findById(userID).populate('friends', 'username fullName');

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const friendIds = user.friends.map(friend => friend._id);

        const users = await User.find({
            $and: [
                { _id: { $nin: [...friendIds, userID] } }, // Exclude current user and existing friends
                { _id: { $ne: userID } } // Exclude current user (not necessary if already handled)
            ]
        }).select('username fullName').limit(20);


        const usersWithRequested = users.map(recommendUser => {
            const isRequested = user.pendingRequests?.includes(recommendUser._id) || false;

            return { ...recommendUser.toObject(), requested: isRequested };
        });

        res.status(200).json({ users: usersWithRequested });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error." });
    }
}


export {
    getFriends,
    addFriend,
    removeFriend,
    pendingFriends,
    recommendFriends,
    addPendingFriend
}
