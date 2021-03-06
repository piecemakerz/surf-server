const sequelize = require("sequelize");
const Op = sequelize.Op;
const { Post, PhasePost, User } = require("../../models");
const { getLengthOfLikeList } = require("../helper");

module.exports = {
  get: async (req, res) => {
    try {
      //유저의 좋아요글목록수, 파도이어가기 수, 파도 일으키기
      const { user } = req.session.passport;
      const countCreateWave = await Post.count({
        where: {
          create_user: user,
        },
      });
      const countJoinWave = await PhasePost.count({
        where: {
          user_id: user,
        },
        include: [
          {
            model: Post,
            as: "wave",
            where: {
              create_user: {
                [Op.notLike]: user,
              },
            },
          },
        ],
      });
      const countLikeWave = await getLengthOfLikeList(User, user);
      const countPosts = {
        countCreateWave,
        countJoinWave,
        countLikeWave,
      };
      res.status(200).json(countPosts);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  },
};
