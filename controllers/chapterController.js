const Chapter = require("../models/Chapter");
const { redisClient } = require("../config/redis");

exports.getAllChapters = async (req, res) => {
  try {
    const key = JSON.stringify(req.query);
    const cached = await redisClient.get(key);
    if (cached) return res.json(JSON.parse(cached));

    const { class: className, unit, status, weakChapters, subject, page = 1, limit = 10 } = req.query;
    const query = {};
    if (className) query.class = className;
    if (unit) query.unit = unit;
    if (status) query.status = status;
    if (subject) query.subject = subject;
    if (weakChapters === "true") query.isWeak = true;

    const chapters = await Chapter.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Chapter.countDocuments(query);

    const result = { total, chapters };
    await redisClient.set(key, JSON.stringify(result), { EX: 3600 }); // ✅ cache for 1 hour
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getChapterById = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) return res.status(404).json({ error: "Chapter not found" });
    res.json(chapter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.uploadChapters = async (req, res) => {
  try {
    let chapters = req.body;
    // console.log(req.body);

    if (!Array.isArray(chapters)) {
      chapters = [chapters];
    }
  //   console.log(chapters);
    const valid = [], invalid = [];

    for (let data of chapters) {
      try {
        const newChapter = new Chapter(data);
        await newChapter.validate();
        valid.push(data);
      } catch (e) {
        invalid.push(data);
      }
    }
    // console.log(valid);
    if (valid.length) await Chapter.insertMany(valid);
    await redisClient.flushAll();
    res.status(200).json({ added: valid.length, failed: invalid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

