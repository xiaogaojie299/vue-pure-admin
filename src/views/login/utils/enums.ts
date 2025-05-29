import { $t } from "@/plugins/i18n";

const operates = [
  {
    title: $t("login.purePhoneLogin")
  }
];

const thirdParty = [
  {
    title: $t("login.pureWeChatLogin"),
    icon: "wechat"
  },
  {
    title: $t("login.pureAlipayLogin"),
    icon: "alipay"
  },
  {
    title: $t("login.pureQQLogin"),
    icon: "qq"
  },
  {
    title: $t("login.pureWeiBoLogin"),
    icon: "weibo"
  }
];

export { operates, thirdParty };
