/*
 * OwO Bot for Discord
 * Copyright (C) 2019 Christopher Thai
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
  */
	
var client;
var auth = require('../../tokens/owo-auth.json');
var admin;
var logChannel = "469352773314412555";
var modLogChannel = "471579186059018241";
const owo = require('../owo.js');

/**
 * Sends a msg to channel
 */
exports.send = function(msg){
	return function(message,del,embed){
		if(del)
			return msg.channel.send(message,embed)
				.then(message => message.delete({timeout:del,reason:'deletion'}))
				.catch(err => console.error(err));
		else
			return msg.channel.send(message,embed)
				.catch(err => console.error(err));
	}
}

/**
 * Sends a msg to channel
 */
exports.reply = function(msg){
	return function(emoji,message,del,embed){
		var username = msg.author.username;
		if(del)
			msg.channel.send(`**${emoji} | ${username}**`+message,embed)
				.then(message => message.delete({timeout:del,reason:'deletion'}))
				.catch(err => console.error(err));
		else
			msg.channel.send(`**${emoji} | ${username}**`+message,embed)
				.catch(err => console.error(err));
	}
}

/**
 * Sends a msg to channel
 */
exports.error = function(errorEmoji,msg){
	return function(message,del,embed){
		var username = msg.author.username;
		var emoji = errorEmoji;
		if(del)
			msg.channel.send(`**${emoji} | ${username}**`+message,embed)
				.then(message => message.delete({timeout:del,reason:'deletion'}))
				.catch(err => console.error(err));
		else
			msg.channel.send(`**${emoji} | ${username}**`+message,embed)
				.catch(err => console.error(err));
	}
}

/**
 * DM a user
 */
exports.msgUser = async function(id,msg){
	id = id.match(/[0-9]+/)[0];
	var user = await client.users.fetch(id,false).catch((err)=>{});
	var success;
	if(user)
		await user.send(msg)
		.then(success = {username:user.username,id:user.id,tag:user.tag})
		.catch(err => success = false);
	return success;
}

/**
 * Sends a message to an admin
 */
exports.msgAdmin = async function (message){
	if(admin==undefined)
		admin = await client.users.fetch(auth.admin,true);
	if(admin!=undefined)
		admin.send(message)
			.catch(err => console.error(err));
}

exports.msgChannel = async function (id,message,options){
	if(!message||!id) return;
	id = id.match(/[0-9]+/)[0];
	client.shard.send({
		type:"sendChannel",
		to:id,
		msg:message,
		options
	});
}

exports.msgLogChannel = async function (message){
	if(!message) return;
	client.shard.send({
		type:"sendChannel",
		to:logChannel,
		msg:message
	});
}

exports.msgModLogChannel = async function (message){
	if(!message) return;
	client.shard.send({
		type:"sendChannel",
		to:modLogChannel,
		msg:message
	});
}

exports.client = function(tClient){
	client = tClient;
}
