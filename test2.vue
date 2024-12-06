<template>
  <div
    :class="['header', channelStore.channel !== 98675412 ? 'channel' : '']"
    v-show="route.meta.useNav"
  >
    <div class="header-logo" @click="toHome">
      <img
        v-if="channelStore.channel !== 98675412"
        :src="channelStore.logo"
        alt="logo"
      />
      <img
        v-else-if="userStore.isDarkTheme"
        src="@/assets/newImg/Owlto_Dark.png"
        alt="logo"
      />
      <img v-else src="@/assets/newImg/Owlto_Light.png" alt="logo" />
    </div>
    <div class="header-nav-channel" v-show="channelStore.channel !== 98675412">
      <a
        :class="[routeIndexChannel === item.link ? 'active' : '']"
        :href="item.link"
        @click.prevent="() => router.push(item.link)"
        v-for="(item, index) in channelNav"
        :key="index"
        >{{ item.title }}</a
      >
    </div>
    <div class="header-nav" v-show="channelStore.channel === 98675412">
      <a
        :class="[
          'item',
          item.title === 'Badges' ? 'badge': null,
          routeIndex === item.name ? 'active' : null,
          item.children ? 'arrow' : null,
          showNavDown ? 'down' : null,
        ]"
        v-for="(item, index) in routeList.filter(
          (item) =>
            !item?.userList ||
            item.userList.includes(
              userStore?.owltoFinanceUserId?.toLocaleLowerCase()
            )
        )"
        :href="item.link"
        :key="item"
        @click.prevent="changeRoute(false, item, index)"
      >
        <span
          >{{ item.title }}
          <template v-if="item.children">
            <img
              v-if="userStore.isDarkTheme"
              src="@/assets/ui3/dark/arrow_down.png"
              alt="arrow"
            />
            <img v-else src="@/assets/ui3/light/arrow_down.png" alt="arrow" />
          </template>
        </span>
        <span
          class="tag"
          :style="`background: ${item.tagColor || 'auto'}; color: ${
            item.color || 'auto'
          }`"
          v-if="item.tag"
        >
          {{ item.tag }}
        </span>
        <div class="children" v-show="item.children && showNavDown">
          <a
            class="children-item"
            v-for="(el, i) in item.children"
            :key="i"
            :href="el.link"
            @click.prevent="changeRoute(true, el, index)"
          >
            <img
              :src="
                userStore.isDarkTheme
                  ? getUI3DarkImg(el.icon)
                  : getUI3LightImg(el.icon)
              "
              alt="icon"
            />
            <span>{{ el.title }}</span>
          </a>
        </div>
        <div v-if="item.name === 'owlympic'" class="owlympic">
          <img :src="getOwlympic('owlympic.svg')" alt="arrow" />
        </div>
      </a>
    </div>
    <div class="header-control">
      <template
        v-if="userStore.owltoFinanceUserId && channelStore.channel === 98675412"
      >
        <div class="points">
          <img src="@/assets/rewards/point.png" alt="" />
          <template v-if="typeof activityStore.navPointNum === 'string'">
            <span class="value">{{ activityStore.navPointNum }}</span>
          </template>
          <template v-else>
            <span class="value">
              <el-statistic
                :value="outputValue"
                :formatter="(num) => num.toFixed()"
              />
            </span>
          </template>
          <div class="points-category">
            <div class="points_category_position"></div>
            <div class="item primary">
              <!-- <div class="label">
                Rank

                <span>(#1000 - 10000)</span>
              </div> -->
            </div>
            <div class="item secondary">
              <div class="label">Phase 2</div>
              <!-- <div class="value">
            <img src="@/assets/img/rocket.png" alt="icon" />
            <span>{{ pointsCategoryData.ratio }}x</span>
          </div> -->
            </div>
            <div class="item card">
              <div class="label">
                Bridge<span class="ratio" v-if="pointsCategoryData.ratio"
                  >{{ pointsCategoryData.ratio }}x</span
                >
              </div>
              <div class="value">
                {{ pointsCategoryData.bridgePoints }} Points
              </div>
            </div>
            <div class="item card">
              <div class="label">Quest</div>
              <div class="value">
                {{ pointsCategoryData.activityPoints }} Points
              </div>
            </div>
            <div class="item card">
              <div class="label">Referral</div>
              <div class="value">
                {{ pointsCategoryData.referPoints }} Points
              </div>
            </div>
            <div class="item card">
              <div class="label">Check in</div>
              <div class="value">
                {{ pointsCategoryData.checkInPoints }} Points
              </div>
            </div>
            <!-- <div class="item card">
              <div class="label">Pool</div>
              <div class="value">
                {{ pointsCategoryData.poolPoints }} Points
              </div>
            </div> -->
            <div class="item secondary">
              <div class="label">Phase 1</div>
              <!-- <div class="value">
            <img src="@/assets/img/rocket.png" alt="icon" />
            <span>{{ pointsCategoryData.ratio }}x</span>
          </div> -->
            </div>
            <div class="item card">
              <div class="label">
                Bridge<span class="ratio" v-if="pointsCategoryData.ratio1"
                  >{{ pointsCategoryData.ratio1 }}x</span
                >
              </div>
              <div class="value">
                {{ pointsCategoryData.bridgePoints1 }} Points
              </div>
            </div>
            <div class="item card">
              <div class="label">Referral</div>
              <div class="value">
                {{ pointsCategoryData.referPoints1 }} Points
              </div>
            </div>
            <div class="tips">
              <a href="https://docs.owlto.finance/points" target="_blank"
                >Know more about points ↗</a
              >
            </div>
          </div>
          <div class="points-animation" v-if="showPointsAnimation">
            +{{ addPointNum }}
          </div>
        </div>
        <div
          :class="['checkIn', signInNew ? 'new' : null]"
          @click="showSignInModal"
        >
          <img
            v-if="userStore.isDarkTheme"
            src="@/assets/ui3/light/checkIn.svg"
            alt=""
          />
          <img v-else src="@/assets/ui3/light/checkIn.svg" alt="" />
        </div>
        <a class="history" @click.prevent.stop="toHistory" href="/history">
          <i class="iconfont icon-HISTORY"></i>
        </a>
      </template>
      <template v-if="routeIndex !== 'swap'">
        <div
          :class="['connected', 'not-swap']"
          v-if="walletStatusShow.status !== 0"
          @click="showWalletList"
        >
          <div class="connected-icon">
            <img :src="walletStatusShow.fromWallet.icon" alt="wallet" />
            <img
              class="secondary"
              v-show="walletStatusShow.status === 2"
              :src="walletStatusShow.toWallet.icon"
              alt="wallet"
            />
          </div>
          <div class="connected-address">
            <span
              v-if="
                userStore.addressDomain &&
                walletStatusShow.fromWallet.chainId === 0
              "
            >
              <span
                >{{ userStore.addressDomain.split(".")[0].substring(0, 8)
                }}{{
                  userStore.addressDomain.split(".")[0].length > 8 ? ".. " : ""
                }}</span
              >
              <span :style="'color:' + userStore.addressDomainColor"
                >.{{ userStore.addressDomain.split(".")[1] }}</span
              >
            </span>
            <span v-else>
              {{ formatUserId(walletStatusShow.fromWallet.address) }}
            </span>
          </div>
          <div class="arrow">
            <img
              v-if="
                channelStore.name === 'U2U' && channelStore.channel !== 98675412
              "
              src="@/assets/ui3/dark/arrow_down2.png"
              alt="more"
            />
            <img
              v-else-if="userStore.isDarkTheme"
              src="@/assets/ui3/dark/arrow_down2.png"
              alt=""
            />
            <img v-else src="@/assets/ui3/light/arrow_down2.png" alt="" />
          </div>
        </div>
        <div class="connect" v-else @click="quitWalletAndOpenWallet(swapChainWalletTag)">
          Connect Wallet
        </div>
      </template>
      <template v-else>
        <div :class="['connected', 'swap']" v-if="swapAccount.status === true" @click="showWalletList">
          <div class="connected-icon">
            <img :src="swapAccount.icon" alt="wallet" />
          </div>
          <div class="connected-address">
            {{ formatUserId(swapAccount.address) }}
          </div>
          <div class="arrow">
            <img v-if="
              channelStore.name === 'U2U' && channelStore.channel !== 98675412
            " src="@/assets/ui3/dark/arrow_down2.png" alt="more" />
            <img v-else-if="userStore.isDarkTheme" src="@/assets/ui3/dark/arrow_down2.png" alt="" />
            <img v-else src="@/assets/ui3/light/arrow_down2.png" alt="" />
          </div>
        </div>
        <div class="connect" v-else @click="bus.$emit('onHomeWallet', swapChainWalletTag)">
          Connect Wallet
        </div>
      </template>

      <div class="more" @click="showMoreHandler">
        <img
          v-if="
            channelStore.name === 'U2U' && channelStore.channel !== 98675412
          "
          src="@/assets/ui3/dark/more.png"
          alt="more"
        />
        <img
          v-else-if="userStore.isDarkTheme"
          src="@/assets/ui3/dark/more.png"
          alt="more"
        />
        <img v-else src="@/assets/ui3/light/more.png" alt="more" />

        <div class="more-children" v-show="showMoreDown">
          <div
            class="item"
            @click.stop.prevent="changeTheme"
            v-show="channelStore.channel === 98675412"
          >
            <span>
              <img
                v-if="userStore.isDarkTheme"
                src="@/assets/ui3/dark/light.png"
                alt=""
              />
              <img v-else src="@/assets/ui3/light/light.png" alt="" />
              Light Mode
            </span>
            <el-switch v-model="themeSwitch" />
          </div>
          <a
            class="item"
            @click.prev.prevent="moreToHandle(item.link)"
            :href="item.link"
            v-for="(item, index) in moreList"
            :key="index"
          >
            <span>
              <img
                :src="
                  userStore.isDarkTheme
                    ? getUI3DarkImg(item.icon)
                    : getUI3LightImg(item.icon)
                "
                alt=""
              />
              {{ item.title }}</span
            >
            <img src="@/assets/ui3/dark/arrow_right.png" alt="" />
          </a>
        </div>
      </div>
    </div>

    <div
      class="background"
      v-show="showNavDown"
      @click="backgroundHandler"
    ></div>
    <div
      class="background"
      v-show="showMoreDown"
      @click="backgroundHandler"
    ></div>
  </div>
  <NetworkList />
  <WalletList />
  <QRCodeModal
    @close="qrCodeModalClose"
    :is-show="qrCodeModal.isShow"
    :uri="qrCodeModal.uri"
  />
  <SignInModal @close="signInModalClose" :is-show="signInModal.isShow" />
</template>
<script setup>
import useStore from "@/store";
import bus from "@/bus";
import NetworkList from "./child/NetworkList.vue";
import WalletList from "./child/WalletList.vue";
import { walletList } from "./walletList";
import { useActivityStore } from "@/store/activity";
import { useOtherStore } from "@/store/other";
import { useChainStore } from "@/store/chain";
import useClipboard from "vue-clipboard3";
import { useRouter, useRoute } from "vue-router";
import { request, request2, request3 } from "@/api/request";
import moment from "moment";
import {
  formatUserId,
  getSvg,
  debounce,
  getNewImg,
  getImg,
  isMobile,
  getWalletIcon,
  pointsFormat,
  getUI3Img,
  getUI3DarkImg,
  getUI3LightImg,
  getOwlympic,
} from "@/common/function.js";
import "vant/es/toast/style";
import QRCodeModal from "@/components/modal/QRCodeModal.vue";
import SignInModal from "@/components/modal/signInModal.vue";
import { myElNotification } from "@/components/ElNotification/myElNotification.js";
import { isInBinance } from "@binance/w3w-utils";
import BigNumber from "bignumber.js";
import { disconnect, watchAccount } from "@wagmi/core";
import { useTransition } from "@vueuse/core";
import { wagmiConfig } from "@/wagmi";
import BaseModal from "../baseModal/BaseModal.vue";
import { computed } from "vue";
const store = useStore();
const router = useRouter();
const route = useRoute();
const {
  useTokenStore,
  useWalletStore,
  useSwapStore,
  useUserStore,
  useStarkNetStore,
  useSolanaStore,
  useChannelStore,
  useBitcoinStore,
  useBenFenStore,
  useEclipseStore,
} = store;
const activityStore = useActivityStore();
const tokenStore = useTokenStore;
const walletStore = useWalletStore;
const userStore = useUserStore;
const swapStore = useSwapStore;
const bitcoinStore = useBitcoinStore;
const starkNetStore = useStarkNetStore;
const solanaStore = useSolanaStore;
const channelStore = useChannelStore;
const benfenStore = useBenFenStore;
const eclipseStore = useEclipseStore;
const routeIndex = ref("bridge");
const showNavDown = ref(false);
const showMoreDown = ref(false);
let addPointNum = ref(0);
let navPointTransitionNum = ref(0);
const outputValue = useTransition(navPointTransitionNum, {
  duration: 1500,
});
let pointTime = null;
let showPointsAnimation = ref(false);
bus.$on("showPointsAnimation", (num) => {
  if (pointTime) {
    clearTimeout(pointTime);
  }
  addPointNum.value = num;
  showPointsAnimation.value = true;
  pointTime = setTimeout(() => {
    showPointsAnimation.value = false;
  }, 1000);
});

const routeIndexChannel = ref("/network/Over");
const channelNav = ref([
  {
    title: "Bridge",
    link: "/network/Over",
    name: "bridge",
  },
  {
    title: "Transactions",
    link: "/network/Over/history",
    name: "history",
  },
]);

onMounted(() => {
  setTimeout(() => {
    if (channelStore.channel !== 98675412 && channelStore.name === "U2U") {
      routeIndexChannel.value = routeIndexChannel.value.replace(
        "Over",
        channelStore.name
      );
      channelNav.value = channelNav.value.map((item) => {
        return {
          ...item,
          link: item.link.replace("Over", channelStore.name),
        };
      });
    }
  }, 500);
});

watch(route, () => {
  routeIndex.value = route.name;
  routeIndexChannel.value = route.path;
});

const signInModal = reactive({
  isShow: false,
});
const signInModalClose = () => {
  signInModal.isShow = false;
};
bus.$on("showSignInModal", () => {
  showSignInModal();
});
const showSignInModal = () => {
  signInModal.isShow = true;
};
const qrCodeModal = reactive({
  isShow: false,
  uri: "",
});

const qrCodeModalClose = () => {
  qrCodeModal.isShow = false;
};
const showMoreHandler = (e) => {
  showMoreDown.value = true;
};
const quitWalletAndOpenWallet = (tag) => {
  bus.$emit("quitWalletAndOpenWallet", tag);
};

const showWalletList = () => {
  bus.$emit("openWalletList");
};
const backgroundHandler = () => {
  showNavDown.value = false;
  showMoreDown.value = false;
};
const themeSwitch = ref(!userStore.isDarkTheme);

const signInNew = computed(() => {
  return userStore.signInNew;
});

const hrefComplete = computed(() => {
  return window.location.href;
});

const changeTheme = (e) => {
  userStore.isDarkTheme = !userStore.isDarkTheme;
  themeSwitch.value = !userStore.isDarkTheme;
  document.documentElement.setAttribute(
    "data-theme",
    userStore.isDarkTheme ? "light" : "dark"
  );
};

const toHome = () => {
  if (channelStore.channel !== 98675412 && channelStore.name === "U2U") {
    routeIndex.value = "/network/U2U";
    router.push("/network/U2U");
  } else if (channelStore.channel !== 98675412) {
    routeIndex.value = "/network/Over";
    router.push("/network/Over");
  } else {
    routeIndex.value = "bridge";
    router.push({ name: "bridge" });
  }
};

const toHistory = () => {
  router.push("/history");
};

const changeRoute = (isSecondoryNav, item, index) => {
  const route = routeList.value.find((c) => c.name === item.name);

  if (route?.children) {
    showNavDown.value = true;
    return;
  }

  routeIndex.value = item.name;
  showNavDown.value = false;

  router.push({ name: item.name });
};
const routeList = ref([
  {
    title: "Bridge",
    name: "bridge",
    link: "/",
  },
  {
    title: "Swap",
    name: "swap",
    link: "/swap",
    tag: "Free",
    tagColor: "#069A14",
    color: "#fff",
  },
  // {
  //   title: "Airdrop",
  //   name: "airdrop",
  //   link: "/airdrop",
  // },
  {
    title: "Rewards",
    name: "rewards",
    link: "/rewards",
    // tag: "Hot",
    // tagColor: "#ff0000",
    // color: "#fff",
  },
  // {
  //   title: "Owlympics",
  //   name: "owlympic",
  //   icon: "deploy.png",
  //   link: "/owlympics",
  // },
  {
    title: "Deploy",
    name: "deploy",
    icon: "deploy.png",
    link: "/deploy",
    tag: "Base",
    tagColor: "#0051fd",
    color: "#fff",
  },
  // {
  //   title: "Owlmazing",
  //   name: "owlmazing",
  //   icon: "deploy.png",
  //   link: "/owlmazing",
  // },
  {
    title: "Tracker",
    name: "Tools",
    class: "arrow",
    children: [
      {
        title: "L2 Interaction",
        name: "tracker",
        icon: "tracker.png",
        link: "/tracker",
      },
      {
        title: "Scroll Marks",
        name: "scrollmarks",
        link: "/tracker/scrollmarks",
        icon: "airdrop.png",
      },
      {
        title: "Linea LXP",
        name: "lxp",
        link: "/tracker/lxp",
        icon: "airdrop.png",
      },
    ],
  },
  {
      title: "Badges",
      name: "scrollbadge",
      link: "/scrollbadge",
      color: "#E5BD89",
  },
  {
    title: "Pool",
    name: "pool",
    link: "/pool",
    userList: [
      "0xC203aD478C4e257ceb7c3DBE24e0c2cA39A7Da45", //kai
      "0x92b56Bc845C861D43362553855278521A521A068", //gua
      "0x2fD14bAc885a2b361957e263E04F0303a5BB0bda", //dk
      "0x10866D6E4E93a44d1Dfe40FAce8304567281Bf08", //vince
      "0x293482d08E0dA618b409BB563E6dac5FA32F0AA2",
      "0xCF2CCF9bA6631dCEaf5a27338C78Ce87314A46a7", //xiaoyi
      "0xe1A1Ce6a31d8e6387e6b21E84480b68E8ef6Dc8e", //yons
      "0x082001358346112A82f2f60edbfB74C290a4C85C", //xinjie
      "0x38F1a77e59eFd6505347f7D1fC1950d5017A0274",
      "0x5Dfc483E3EA37fd85825f5C9Ffddc01E4a37A866", // jinshu
      "0x2bA78f26Dc0b655a97b133556471f6AfBbe5e056", //svea
      "0x6c07d1E6F8b4e04DEc5A6A1baeD572a0C8c2320C", // wangshu
    ].map((item) => item.toLocaleLowerCase()),
  },
  // {
  //   title: "About",
  //   name: "ecosystem",
  //   link: "/ecosystem",
  // },
]);

const moreList = reactive([
  {
    title: "Support",
    icon: "support.png",
    link: "https://discord.com/channels/1091253788481961994/1138350398349004810",
  },
  {
    title: "Terms of use",
    icon: "terms.png",
    link: "https://owlto.finance/files/Owlto_TOS.pdf",
  },
]);

const moreToHandle = (link) => {
  window.open(link, "_blank");
};

watchAccount(wagmiConfig, {
  onChange(account) {
    if (account.isConnected) {
      getPoints(account.address);
    }
  },
});

watch(route, () => {});

onMounted(async () => {
  bus.$on("refreshPoints", () => {
    getPoints();
  });
  if (userStore.owltoFinanceUserId) {
    // getPoints();
  }

  if (channelStore.channel !== 98675412 && channelStore.name === "U2U") {
    moreList.length = 0;
    moreList.push(
      {
        title: "About U2U",
        icon: "terms.png",
        link: "https://u2u.xyz/",
      },
      {
        title: "Support",
        icon: "support.png",
        link: "https://discord.gg/6bPaDU8pk3",
      }
    );
  } else if (channelStore.channel !== 98675412) {
    // const list = [
    //   "Gate Wallet",
    //   "Nabox Wallet",
    //   "Coin98 Wallet",
    //   "imToken",
    //   "Over Wallet",
    // ];
    // walletList.data = [
    //   {
    //     icon: getSvg("overChain.png"),
    //     name: "Over Wallet",
    //     findConnectorName: "OverWallet",
    //   },
    //   ...walletList.data.filter((item) => !list.includes(item.name)),
    // ];

    moreList.length = 0;
    moreList.push(
      {
        title: "About Over",
        icon: "terms.png",
        link: "https://over.network",
      },
      {
        title: "Support",
        icon: "support.png",
        link: "http://discord.gg/overprotocol",
      }
    );
  }

  const index = routeList.value.findIndex(
    (item) => item.link === location.pathname
  );
  if (index !== -1) {
    routeIndex.value = routeList.value[index].name;
  } else {
    routeIndex.value = "";
  }
});
let reloadPointsNum = 0;
const getPoints = async (address) => {
  const check = address || userStore.owltoFinanceUserId;
  if (!check) return;
  activityStore.navPointNum = "loading";
  console.log("check123", check);
  try {
    // const data1 = await request({
    //   url: "lottery/maker/points/all",
    //   params: {
    //     address: address || userStore.owltoFinanceUserId,
    //   },
    // });
    // activityStore.navPointNum = data1.data;
    // navPointTransitionNum.value = data1.data;

    const { data } = await request({
      url: "lottery/maker/points/category",
      params: {
        address: check,
      },
    });
    const { referPointsV1, bridgePointsV1 } = data;

    const res = await request3({
      method: "GET",
      url: `/campaign_api/v1/${check}/points`,
    });
    if (res.data.code === 0) {
      pointsCategoryData.ratio = res?.data?.data?.multiplier;
      pointsCategoryData.checkInPoints = res?.data?.data?.check_in_points;
      pointsCategoryData.activityPoints = res?.data?.data?.campaign_points;
      pointsCategoryData.bridgePoints = res?.data?.data?.cross_points;
      pointsCategoryData.referPoints = res?.data?.data?.refer_points;
      pointsCategoryData.poolPoints = res?.data?.data?.pool_points || 0;
    }
    //phase 1
    const res3 = await request({
      url: "reward/points-list",
      params: {
        user: check,
        page: 1,
      },
    });
    if (res3?.msg.length > 0) {
      let bridgeCount = 0;
      res3.msg.map((item) => {
        if (item.sender.toLocaleLowerCase() === check.toLocaleLowerCase()) {
          // bridgeNumber1 += item.points;
          bridgeCount += item.count;
        }
      });
      pointsCategoryData.ratio1 = get_count_ratio(bridgeCount);
    }
    pointsCategoryData.bridgePoints1 = bridgePointsV1;
    pointsCategoryData.referPoints1 = referPointsV1;

    let contNumber =
      bridgePointsV1 +
      referPointsV1 +
      pointsCategoryData.checkInPoints +
      pointsCategoryData.activityPoints +
      pointsCategoryData.referPoints +
      pointsCategoryData.bridgePoints +
      pointsCategoryData.poolPoints;
    activityStore.navPointNum = contNumber;
    navPointTransitionNum.value = contNumber;
  } catch (error) {
    console.log("error", error);
    activityStore.navPointNum = "loading";
    pointsCategoryData.bridgePoints1 = 0;
    pointsCategoryData.referPoints1 = 0;
    pointsCategoryData.ratio1 = 0;
    pointsCategoryData.checkInPoints = 0;
    pointsCategoryData.bridgePoints = 0;
    pointsCategoryData.referPoints = 0;
    pointsCategoryData.ratio = 0;
    pointsCategoryData.activityPoints = 0;
    pointsCategoryData.poolPoints = 0;
    // reload 3 num
    reloadPointsNum++;
    if (reloadPointsNum > 2) return;
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve();
      }, 3000)
    );
    await getPoints(address);
  }
};

const pointsCategoryData = reactive({
  show: false,
  ratio: 0,
  bridgePoints: 0,
  referralPoints: 0,
  checkInPoints: 0,
  poolPoints: 0,

  activityPoints: 0,

  ratio1: 0,
  bridgePoints1: 0,
  referralPoints1: 0,
});

if (isInBinance()) {
  walletList.data.length = 0;
  walletList.data.push({
    icon: getNewImg("binance.jpg"),
    name: "Binance Web3 Wallet",
    findConnectorName: "MetaMask",
  });
}

const walletStatusShow = computed(() => {
  let status = 2;
  // if (channelStore.channel !== 98675412) {
  //   const list = [
  //     "Gate Wallet",
  //     "Nabox Wallet",
  //     "Coin98 Wallet",
  //     "imToken",
  //     "Over Wallet",
  //   ];
  //   walletList.data = [
  //     {
  //       icon: getSvg("overChain.png"),
  //       name: "Over Wallet",
  //       findConnectorName: "OverWallet",
  //     },
  //     ...walletList.data.filter((item) => !list.includes(item.name)),
  //   ];
  // }
  const more = [
    {
      chainId: 0,
      status: walletStore.isWallet,
      address: userStore.owltoFinanceUserId,
      icon: walletList.data[walletStore.currentIconIndex].icon,
    },
    {
      chainId: 666666666,
      status: starkNetStore.starkNetInfo.isConnected,
      address: starkNetStore.starkNetInfo.selectedAddress,
      icon:
        {
          "Argent X": getWalletIcon("argent.png"),
          Braavos: getWalletIcon("braavos.png"),
        }[starkNetStore.starkNetInfo.wallet] || getWalletIcon("starknet.png"),
    },
    {
      chainId: 83797601,
      status: solanaStore.isConnected,
      address: solanaStore.address,
      icon: solanaStore.icon,
    },
    {
      chainId: 69677601,
      status: eclipseStore.isConnected,
      address: eclipseStore.address,
      icon: eclipseStore.icon,
    },
    {
      chainId: 999706684,
      status: bitcoinStore.isConnected,
      address: bitcoinStore.address,
      icon: bitcoinStore.icon,
    },
    {
      chainId: 999706677,
      status: bitcoinStore.isConnected,
      address: bitcoinStore.address,
      icon: bitcoinStore.icon,
    },
    {
      chainId: 66706701,
      status: benfenStore.isConnected,
      address: benfenStore.address,
      icon: benfenStore.icon,
    },
  ];
  const fromWallet =
    more.find((item) => item.chainId === tokenStore.fromChainId) || more[0];
  const toWallet =
    more.find((item) => item.chainId === tokenStore.toChainId) || more[0];
  if (!fromWallet.status) {
    status = 0;
  } else if (toWallet.chainId === fromWallet.chainId) status = 1;

  walletStore.fromWallet = fromWallet;
  walletStore.toWallet = toWallet;
  walletStore.status = status;
  return { fromWallet: fromWallet, toWallet: toWallet, status };
});

const swapAccount = computed(() => {
  const more = [
    {
      chainId: "0",
      status: walletStore.isWallet,
      address: userStore.owltoFinanceUserId,
      icon: walletList.data[walletStore.currentIconIndex].icon,
    },
    {
      chainId: "83797601",
      status: solanaStore.isConnected,
      address: solanaStore.address,
      icon: solanaStore.icon,
    }
  ];
  //const account = more.find((item) => item.chainId === swapStore.sourceChainId) || more[0];
  const account = more.find((item) => item.chainId === swapStore.sourceChainId) || more[0];

  return account;
});

const swapChainWalletTag = computed(() => {
  if (swapStore.sourceChainId === "83797601") {
    return 'Solana';
  } else {
    return 'EVM';
  }
});


const get_count_ratio = (count) => {
  let ratio = 1;
  if (count >= 1 && count < 3) {
    ratio = 1;
  } else if (count >= 3 && count <= 10) {
    ratio = 1.2;
  } else if (count >= 11 && count <= 50) {
    ratio = 1.4;
  } else if (count >= 51 && count <= 100) {
    ratio = 1.6;
  } else if (count > 100) {
    ratio = 1.8;
  }
  return ratio;
};
</script>

<style lang="scss" scoped>
@keyframes points {
  0% {
    opacity: 0;
  }
  100% {
    transform: translateY(-25px);
  }
}

.points-animation {
  position: absolute;
  // left: -100px;
  // top: 50px;
  right: 16px;

  animation-name: points;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  [data-theme="light"] & {
    color: #fcca00;
  }
}

.header {
  width: 100%;
  height: 88px;

  // position: fixed;
  // left: 0;
  // top: 50px;
  box-sizing: border-box;
  padding: 0 40px 0;
  display: grid;
  grid-template-columns: 0.5fr 1fr 0.5fr;
  z-index: 100;
  align-items: center;

  * {
    box-sizing: border-box;
  }

  img {
    width: 100%;
  }

  > div {
    height: 100%;
    display: flex;
    align-items: center;
    position: relative;
  }

  &-logo {
    cursor: pointer;
    > img {
      width: 180px;
    }
  }
  grid-template-columns: 250px 1fr 0.5fr;

  &.channel {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-logo {
      flex: 1;
      > img {
        width: 240px;
      }
    }

    .header-control {
      flex: 1;
    }
  }

  &-nav-channel {
    background-color: #ebebeb;
    border-radius: 40px;
    height: 58px !important;
    width: 300px;
    display: flex;
    justify-content: space-around;
    overflow: hidden;

    [data-channel="u2u"] & {
      background-color: #14513d;
    }

    > a {
      height: 100%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 40px;
      flex: 1;
      transition: all 0.1s;
      font-size: 18px;
      color: #111;

      &.active {
        background-color: #fcca00;
        background-color: #000000;
        color: #fff;
      }

      [data-channel="u2u"] & {
        color: white;
        &.active {
          background-color: #20b486;
          color: #fff;
        }
      }
    }
  }

  &-nav {
    justify-content: flex-start;
    padding-left: 10px;
    gap: 20px;
    font-size: 20px;

    > a {
      padding: 12px 18px;
      border-radius: 100px;
      border: 1px solid rgba(255, 255, 255, 0);
      transition: all 0.1s;
      position: relative;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      user-select: auto;

      > span {
        display: flex;
        align-items: center;
        gap: 10px;
        transition: all 0.1s;
        > img {
          width: 13px;
          height: 8px;
          transform: rotate(0deg);
          transition: all 0.1s;
        }
      }

      .tag {
        position: absolute;
        right: -12px;
        top: -6px;
        box-sizing: border-box;
        padding: 1px 4px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 50px;
        letter-spacing: 0.8px;
        font-size: 12px;
      }

      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 15%;
        width: 8px;
        height: 8px;
        background-color: #f4c237;
        transition: all 0.1s;
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
      }

      &.badge{
        color: #E5BD89 !important;
      }

      &.active {
        padding: 12px 18px 12px 32px;
        &::after {
          transform: translate(-50%, -50%) scale(1);
        }
      }

      &.active,
      &:hover {
        > span {
          color: #fff;
        }
        // border: 1px solid rgba(255, 255, 255, 0.3);
      }

      &.arrow {
        border: 1px solid rgba(255, 255, 255, 0);
        padding: 16px 20px 16px 36px;
        position: relative;
        gap: 10px;
        cursor: initial;

        > span {
          cursor: pointer;
        }
        &::after {
          transform: translate(-50%, -50%) scale(0);
        }

        &.active {
          > img {
            transform: rotate(0);
          }
        }

        > .children {
          position: absolute;
          width: 283px;
          #height: 150px;
          height: 190px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: #363635;
          left: 50%;
          top: 100%;
          padding: 18px 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 102;

          .children-item {
            display: flex;
            gap: 10px;
            height: 56px;
            align-items: center;
            border-radius: 10px;
            padding: 10px 20px;
            font-size: 16px;
            background-color: #212120;
            color: rgba(255, 255, 255, 0.6);
            transition: all 0.1s;
            cursor: pointer;

            > img {
              width: 16px;
            }

            &:hover {
              color: #fff;
            }
          }
        }

        &.down {
          > span > img {
            transform: rotate(180deg);
          }
        }
      }

      .owlympic {
        // background-color: #FFEEDA;
        // background-color: purple;
        // background-color: white;
        border-radius: 20px;
        position: absolute;
        top: -5px;
        right: -7px;
        width: 50px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 10px;
        img {
          width: 40px;
          height: auto;
        }
      }
    }
  }

  &-control {
    justify-content: flex-end;
    gap: 14px;
    align-items: center;

    > .points,
    > .checkIn,
    > .history {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 58px;
      width: 58px;
      background-color: #262113;
      border-radius: 16px;
      cursor: pointer;
      border: 3px solid rgba(0, 0, 0, 0);
      transition: all 0.15s;

      > img {
        width: 28px;
      }

      &:hover {
        border: 3px solid #f4c237;
      }
    }

    > .checkIn {
      position: relative;

      &.new {
        &::before {
          content: "";
          position: absolute;
          right: 5px;
          top: 5px;
          width: 8px;
          height: 8px;
          background-color: #f00d0d;
          border-radius: 50%;
        }
      }
    }

    > .history {
      > .iconfont {
        font-size: 28px;
      }

      color: #fff;

      [data-theme="dark"] & {
        color: #333;
      }
    }

    > .points {
      border-radius: 48px;
      font-size: 20px;
      gap: 10px;
      padding: 0 14px;
      min-width: 140px;
      width: initial;
      position: relative;
      // justify-content: flex-start;
      justify-content: center;

      .points-category {
        position: absolute;
        left: -4%;
        top: 160%;
        background-color: #181818;
        width: 0px;
        height: 0px;
        box-sizing: border-box;
        cursor: auto;
        padding: 12px 16px 6px;
        transition: height 0.2s;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: #363635;
        gap: 5px;
        opacity: 0;
        z-index: 100;
        .points_category_position {
          position: fixed;
          top: 120px;
          height: 40px;
          width: 120px;
          z-index: 200;
          display: none;
        }

        &.show {
          height: 520px;
          padding: 12px 16px 6px;
          background-color: #363635;
          opacity: 1;
        }

        > .item {
          display: flex;
          justify-content: space-between;
          font-size: 16px;
          font-weight: 400;
          color: white;
          padding: 0 2px;
          box-sizing: border-box;

          &.card {
            background-color: #212120;
            padding: 12px 14px;
            border-radius: 10px;
          }

          > .value {
            display: flex;
            align-items: center;
            color: rgba($color: #fff, $alpha: 0.6);
            > img {
              width: 18px;
              margin-right: 6px;
            }
          }

          .ratio {
            border: 1px solid;
            padding: 0 5px;
            border-radius: 5px;
            color: #e2c160;
            font-size: 13px;
            margin-left: 5px;
          }
        }

        .tips {
          font-size: 12px;
          font-style: italic;
          display: flex;
          justify-content: center;
          padding-top: 6px;

          > a {
            color: #bebebe;
            &:hover {
              text-decoration: underline;
            }
          }
        }

        .primary {
          color: #fff;
          font-size: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding-bottom: 4px;

          span {
            color: rgba($color: #fff, $alpha: 0.6);
            font-size: 14px;
          }
        }

        .secondary {
          font-weight: 600 !important;
          color: #fff;
          font-size: 14px;
        }

        > .br {
          width: 100%;
          height: 1px;
          border-top: 2px dashed #bbbbbb;
          margin: 6px 0;
        }
      }

      &:hover {
        .points-category {
          // height: 485px;
          height: 440px;
          width: 400px;
          padding: 8px 16px 4px;
          background-color: #363635;
          opacity: 1;
        }
        .points_category_position {
          display: block;
        }
      }

      [data-theme="dark"] & {
        .points-category {
          background-color: #fff;

          .primary {
            color: #000;

            span {
              color: rgba($color: #000, $alpha: 0.8);
            }
          }

          .card {
            background-color: #f7f7f7;
            color: #000;

            .value {
              color: rgba($color: #000000, $alpha: 0.6);
            }
          }
        }

        &:hover {
          .points-category {
            background-color: #fff;

            > .item {
              .label {
                color: #333333;
              }

              &.secondary {
                .label {
                  color: #000;
                }
              }

              .value {
                color: #4f4f4f;
              }
            }

            .tips a {
              color: #6c6c6c;
            }
          }
        }
      }

      > img {
        width: 40px;
      }
      :deep(.el-statistic) {
        .el-statistic__number {
          font-weight: 500 !important;
          color: #fcca00;
          [data-theme="dark"] & {
            color: #090100;
          }
        }
      }
    }

    > .connect {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 194px;
      height: 58px;
      background-color: #f4c237;
      font-size: 20px;
      font-weight: 500;
      color: #000;
      border-radius: 16px;
      cursor: pointer;

      [data-channel="over"] & {
        background-color: #f5773e;
        color: #fff;
      }

      [data-channel="u2u"] & {
        background-color: #20b486;
        color: #fff;
      }
    }

    > .more {
      width: 58px;
      height: 58px;
      background-color: #262113;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 16px;
      transition: all 0.15s;
      border: 3px solid #262113;
      position: relative;

      > img {
        width: 18px;
      }

      &:hover {
        background-color: #262113;
        border: 3px solid #f4c237;

        [data-channel="u2u"] & {
          border: 3px solid #20b486;
        }
      }

      > .more-children {
        position: absolute;
        width: 283px;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: #363635;
        left: 0;
        top: 100%;
        transform: translate(-100%, 6%);
        padding: 18px 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 102;
        cursor: initial;

        > .item {
          display: flex;
          gap: 10px;
          height: 56px;
          align-items: center;
          justify-content: space-between;
          border-radius: 10px;
          padding: 10px 20px;
          font-size: 16px;
          background-color: #212120;
          color: #fff;
          transition: all 0.1s;
          cursor: pointer;

          > span {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          img {
            width: 20px;
          }
        }
      }
    }

    > .connected {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 58px;
      gap: 10px;
      border-radius: 16px;
      background: rgba(244, 194, 55, 0.1);
      padding: 0 14px;
      cursor: pointer;

      .connected-icon {
        width: 36px;
        position: relative;
        display: flex;
        align-items: center;

        .secondary {
          position: absolute;
          right: -4px;
          bottom: 0px;
          width: 30px;
          height: 30px;
        }
      }

      .connected-address {
        font-size: 20px;
      }

      .arrow {
        width: 24px;
        display: flex;
        align-items: center;
      }
    }
  }

  > .background {
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0px;
    background-color: rgba(255, 255, 255, 0);
    position: absolute;
    z-index: 99;
  }

  [data-theme="dark"] & {
    &-nav {
      > a {
        color: rgba(0, 0, 0, 0.6);

        &.active {
          padding: 12px 18px 12px 32px;
          &::after {
            transform: translate(-50%, -50%) scale(1);
          }
        }

        &.active,
        &:hover {
          > span {
            color: #000;
          }
        }

        &.arrow {
          border: 1px solid rgba(0, 0, 0, 0);
        }

        > .children {
          background-color: #ffffff;

          > .children-item {
            background-color: #f7f7f7;
            color: rgba(0, 0, 0, 0.6);

            &:hover {
              color: #000;
            }
          }
        }

        .children {
          background-color: #ffffff;

          > .children-item {
            background-color: #f7f7f7;
          }
        }
      }
    }

    &-control {
      > .more {
        background-color: #ebebeb;
        border: 3px solid #ebebeb;

        &:hover {
          border: 3px solid #f4c237;
        }

        > .more-children {
          background-color: #ffffff;

          > .item {
            background-color: #f7f7f7;
            color: #000;
          }
        }
      }

      > .history {
        background-color: #ebebeb;
      }

      > .points {
        background-color: #ebebeb;
      }

      > .checkIn {
        background-color: #ebebeb;
      }

      > .connected {
        background-color: #eaeaea;
      }
    }
  }
}

@media screen and (max-width: 550px) {
  .header-nav,
  .history,
  .points,
  .more {
    display: none !important;
  }
  .header {
    display: flex;
    justify-content: space-between;
    padding: 20px 10px 0;
  }
}
</style>
