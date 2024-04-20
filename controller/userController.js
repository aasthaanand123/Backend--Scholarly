const express = require("express");
const user = require("../models/user");
const jwt = require("jsonwebtoken");
const cheerio = require("cheerio");
const axios = require("axios");
// add a user to database
module.exports.addUser = async (req, res) => {
  try {
    let data = req.body;
    let users = this.findUsers(data.email, data.password);
    if (users.length > 0) res.json({ status: "already exists" });
    let sign_up = await user.create({
      name: {
        first: data.firstName,
        last: data.lastName,
      },
      email: data.email,
      password: data.password,
      percentage10th: data.percentage10th,
      percentage12th: data.percentage12th,
      percentageUg: data.percentageUg,
      ugDegree: data.ugDegree,
      intendedDegree: data.intendedDegree,
    });
    res.json({ status: "success" });
  } catch (err) {
    console.log(err);
  }
};
//sign in, send a jwt token to client
module.exports.signInUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = await this.findUsers(username, password);
    if (users.length == 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign(
      { userId: users[0]._id, username: users[0].username },
      "shhh"
    );
    res.json({ token: token });
  } catch (err) {
    console.log(err);
  }
};
//find a user
module.exports.findUsers = async (username, password) => {
  try {
    let user_details = await user.find({
      username: username,
      password: password,
    });
    return user_details;
  } catch (err) {
    console.log(err);
  }
};
module.exports.userInfo = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
      const user_data = jwt.verify(token, "shhh");
      let id = user_data.userId;
      let data_sent = await user.findOne({ _id: id });
      res.json({
        status: true,
        data: data_sent,
      });
    } else {
      res.json({
        status: false,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports.updateuserInfo = async (req, res) => {
  try {
    let data = req.body;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
      const user_data = jwt.verify(token, "shhh");
      let id = user_data.userId;
      let data_sent = await user.updateOne(
        { _id: id },
        {
          $set: {
            name: {
              first: data.firstName,
              last: data.lastName,
            },
            password: data.password,
            email: data.email,
            percentage10th: data.percentage10th,
            percentage12th: data.percentage12th,
            ugDegree: data.ugDegree,
            percentageUg: data.percentageUg,
            intendedDegree: data.intendedDegree,
          },
        }
      );
      res.json({
        status: true,
        data: data_sent,
      });
    } else {
      res.json({
        status: false,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

async function fetchHTML(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function scrapeData(url) {
  try {
    const html = await fetchHTML(url);
    if (!html) return;
    let data = [];
    const $ = cheerio.load(html);
    //send an object from here containing different fields in the scholarship
    $(".right").each((index, element) => {
      let list_links = [];
      $(element)
        .find(".skills li")
        .each((index, el) => {
          list_links.push($(el).text());
        });
      let curr_obj = {
        heading: "",
        heading_link: "",
        links: list_links,
        content: "",
      };
      curr_obj.heading = $(element).find("h3").text();
      curr_obj.content = $(element).find("p").find("span").text();
      if (!curr_obj.content.trim()) {
        curr_obj.content = $(element).find("p").text();
      }
      data.push(curr_obj);
    });
    let counter = 0;
    $(".resume-item").each((index, element) => {
      let img_url = $(element).find("a").find("img").attr("src");
      data[counter].img_url = img_url;
      counter++;
    });
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function scrapeAllScholarships(baseUrl) {
  try {
    let allScholarships = [];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage && page < 10) {
      const url = `${baseUrl}&page=${page}`;
      const scholarships = await scrapeData(url);

      if (scholarships && scholarships.length === 0) {
        hasNextPage = false;
      } else {
        allScholarships = allScholarships.concat(scholarships);
        page++;
      }
    }

    return allScholarships;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

module.exports.scholarshipsData = async (request, response) => {
  try {
    let { url } = request.body;
    let resp_data = await scrapeAllScholarships(url);
    response.json(resp_data);
  } catch (err) {
    console.log(err);
  }
};
