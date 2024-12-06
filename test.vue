<template>
  <div class="hot_box" 
    v-if="
      ['EthereumMainnet', 'BaseMainnet', 'BnbMainnet'].includes(swapStore.allSourceChains.find((chain) => chain.chain_id == swapStore.sourceChainId)?.name)
    "
  >
    <img class="hot_img" src="@/assets/swap/hot.png" alt="">
    <CarouselContainer :tokenName="swapStore.allSourceChains.find((chain) => chain.chain_id == swapStore.sourceChainId)?.name" :changeFn="carouselContainerFn"/>
    <div class="hot_text">© DEXTools</div>
  </div>
  <div class="swap">
    <div class="swap-head">
      <div class="left" @click="networkList.show = true">
        <div class="label">Swap on</div>
        <div class="value">
          <img  
            :src="
              swapStore.allSourceChains.find(
                (chain) => chain.chain_id == swapStore.sourceChainId
              )?.icon || 'https://owlto.finance/icon/chain/Ethereum.png '
            "
            alt="chain"
          />
          <span>
            {{
              swapStore.allSourceChains.find(
                (chain) => chain.chain_id == swapStore.sourceChainId
              )?.alias_name
            }}
          </span>
          <img
            v-if="userStore.isDarkTheme"
            class="arrow"
            src="@/assets/ui3/arrow_right.png"
            alt=""
          />
          <img
            v-else
            class="arrow"
            src="@/assets/ui3/light/arrow_right2.png"
            alt=""
          />
        </div>
      </div>

      <div class="right">
        <div
          :class="['loading', loadingByClick ? 'is-loading' : '']"
          @click="initQuotesByLoading()"
        >
          <img
            v-if="userStore.isDarkTheme"
            src="@/assets/swap/reload.png"
            alt=""
          />
          <img v-else src="@/assets/swap/dark/reload.png" alt="" />
        </div>
        <div class="setting" @click="slippage.show = true">
          <img
            v-if="userStore.isDarkTheme"
            src="@/assets/swap/setting.png"
            alt=""
          />
          <img v-else src="@/assets/swap/dark/setting.png" alt="" />
        </div>
      </div>
    </div>
    <div class="swap-from">
      <div>
        <div
          class="token"
          @click="
            async () => {
              tokenList.show = true;
              await initPopularTokens();
              queryBalancesFn();
              // initBalance();
              // await initPopularTokens(undefined, 'init');
              tokenList.position = 'from';
            }
          "
        >
          <img :src="fromTokenValue.icon" alt="" />
          <div class="name">{{ fromTokenValue.name }}</div>
          <img
            v-if="userStore.isDarkTheme"
            class="arrow"
            src="@/assets/ui3/arrow_right.png"
            alt=""
          />
          <img
            v-else
            class="arrow"
            src="@/assets/ui3/light/arrow_right2.png"
            alt=""
          />
        </div>
        <div class="value">
          <input
            v-model="swapStore.inputValue"
            placeholder="0.0"
            @input="fromValueFormatHandle"
            maxlength="8"
          />
          <div class="balance" v-show="swapAccount.status">
            <template v-if="!balanceLoading">
              <span class="max" @click="maxInputHandle">Max</span>
              <span
                >Balance:
                {{
                  trimTrailingZeros(
                    getToFixed(
                      BigNumber(
                        swapStore.balanceList.find(
                          (token) => token.name === fromTokenValue.name
                        )?.balance || "0"
                      )
                        .div(
                          10 **
                            (fromTokenValue.decimals || "0")
                        )
                        .toFixed(6)
                    )
                  )
                }}</span
              >
            </template>
            <template v-else>
              <span>Balance: loading</span>
            </template>
          </div>
          <div
            class="price"
            v-show="
              Number(swapStore.inputValue) > 0 &&
              Number(swapStore.fromPrice) > 0
            "
          >
            ~${{ swapStore.fromPrice }}
          </div>
        </div>
      </div>
    </div>
    <div class="pair_box">
      <div :class="['swap-pair']" @click="swapPair">
        <img src="@/assets/swap/swap.png" alt="" />
      </div>
    </div>
    <div class="swap-to">
      <div>
        <div
          class="token"
          @click="
            async () => {
              tokenList.show = true;
              await initPopularTokens();
              queryBalancesFn();
              // initBalance();
              // await initPopularTokens(undefined, 'init');
              tokenList.position = 'to';
            }
          "
        >
          <img :src="toTokenValue.icon" alt="" />
          <div class="name">{{ toTokenValue.name }}</div>
          <img
            v-if="userStore.isDarkTheme"
            class="arrow"
            src="@/assets/ui3/arrow_right.png"
            alt=""
          />
          <img
            v-else
            class="arrow"
            src="@/assets/ui3/light/arrow_right2.png"
            alt=""
          />
        </div>
        <div class="value">
          <input
            v-if="!inputLoading"
            disabled
            v-model="swapStore.toValue"
            placeholder="0.0"
            maxlength="8"
          />
          <input v-else disabled placeholder="loading" maxlength="8" />
          <div class="balance" v-show="swapAccount.status">
            <span v-if="!balanceLoading"
              >Balance:
              {{
                trimTrailingZeros(
                  getToFixed(
                    BigNumber(
                      swapStore.balanceList.find(
                        (token) => token.name === toTokenValue.name
                      )?.balance || "0"
                    )
                      .div(
                        10 **
                          (toTokenValue.decimals)
                      )
                      .toFixed(6)
                  )
                )
              }}</span
            >
            <span v-else>Balance: loading</span>
          </div>
          <div
            class="price"
            v-show="
              Number(swapStore.toValue) > 0 &&
              Number(swapStore.priceByToValue) > 0
            "
          >
            ~${{ swapStore.priceByToValue }}
            <span
              :style="`color: ${Number(getMinimumReceivePrice()) < -3 ? 'red' : ''}`"
              v-if="
                getMinimumReceivePrice() != '0' &&
                Number(getMinimumReceivePrice()) < -0.5
              "
            >
              <el-popover
                :effect="userStore.isDarkTheme ? 'dark' : 'light'"
                placement="top"
                :width="200"
                trigger="hover"
              >
                <span class="myTip-msg">
                  The estimated difference between the USD values of input and
                  output amounts.
                </span>
                <template #reference>
                  ({{ getMinimumReceivePrice() }}%)
                </template>
              </el-popover>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="swap-submit"
      @click="swapHandle"
      v-if="!swapAccount.status"
    >
      Connect Wallet
    </div>
    <div
      class="swap-submit disabled"
      v-else-if="
        Number(swapStore.inputValue) === 0 ||
        Number(swapStore.toValue) === 0 ||
        (inputStatus != 1 && inputStatus != 3 && inputStatus != 5)
      "
    >
      {{ inputText[inputStatus] }}
      <TextLoading class="btn-loading" v-show="swapLoading" />
    </div>
    <div
      v-else-if="inputStatus === 3"
      :class="['swap-submit', { disabled: initQuotesLoading }]"
      @click="approveFn"
    >
      {{ inputText[inputStatus] }}
      <TextLoading class="btn-loading" v-show="approveFnLoading" />
    </div>
    <div
      v-else-if="inputStatus === 5"
      :class="['swap-submit', { disabled: initQuotesLoading }]"
    >
      {{ inputText[inputStatus] }}
      <TextLoading class="btn-loading" v-show="approveFnLoading" />
    </div>
    <div
      v-else-if="inputStatus === 4"
      :class="['swap-submit', { disabled: true }]"
    >
      {{ inputText[inputStatus] }}
    </div>
    <div
      :class="['swap-submit', { disabled: initQuotesLoading }]"
      @click="initQuotesLoading ? () => {} : openConfirmation()"
      v-else
    >
      {{ inputText[inputStatus] }}
    </div>

    <div :class="['swap-confirm', getShowConfirm() ? 'show' : null, {'iZiSwap-show': ['PancakeSwap', 'iZiSwap'].includes(swapStore?.dexName) && getShowConfirm()}]">
      <div class="group">
        <div class="label">
          <img src="@/assets/swap/price.png" alt="price" />
          1 {{ fromTokenValue.name }} ≈
          {{
            swapStore.amountOut ? formatDecimal(swapStore.amountOut, 2) : "--"
          }}
          {{ toTokenValue.name }}
          <span class="secondary"
            >(${{
              formatDecimal(swapStore.fromTokenPrice, 2) == "0"
                ? "-"
                : formatDecimal(swapStore.fromTokenPrice, 2)
            }})</span
          >
        </div>
        <div class="value">&nbsp;</div>
      </div>
      <div class="group secondary gas_div" v-if="!['PancakeSwap', 'iZiSwap'].includes(swapStore?.dexName)">
        <div class="label">
          <img
            v-if="userStore.isDarkTheme"
            src="@/assets/swap/dark/gas.png"
            alt="price"
          />
          <img v-else src="@/assets/swap/gas.png" alt="" />
          Network gas fee
        </div>
        <div class="value">
          {{
            swapStore.inputValue
              ? `${
                  swapStore.gasEstimateUsd
                    ? `$${swapStore.gasEstimateUsd}`
                    : "--"
                }`
              : "--"
          }}
        </div>
      </div>
      <div class="group secondary slippage_div">
        <div class="label">
          <img
            v-if="userStore.isDarkTheme"
            src="@/assets/swap/dark/slippage.png"
            alt="price"
          />
          <img v-else src="@/assets/swap/slippage.png" alt="" />
          Slippage
          <el-popover
            trigger="hover"
            :effect="userStore.isDarkTheme ? 'dark' : 'light'"
          >
            <template #reference>
              <i :class="['iconfont', 'info']"></i>
            </template>
            <template #default>
              Slippage refers to the difference in percentage between the
              expected price and the final price after the transaction has been
              completed. If the final price exceeds your slippage tolerance, the
              transaction will be canceled without a refund of the network fee.
            </template>
          </el-popover>
        </div>
        <div class="value open-slippage" @click="slippage.show = true">
          <span>{{
            swapStore.slippageInput
              ? `${swapStore.slippageInput}%`
              : slippageList[slippageNavIndex].label || "Auto"
          }}</span>
          <img
            v-if="userStore.isDarkTheme"
            class="arrow"
            src="@/assets/ui3/arrow_right.png"
            alt=""
          />
          <img
            v-else
            class="arrow"
            src="@/assets/ui3/light/arrow_right2.png"
            alt=""
          />
        </div>
      </div>
      <div class="group secondary minimum_receive">
        <div class="label">
          <img
            v-if="userStore.isDarkTheme"
            src="@/assets/swap/dark/minimum.svg"
            alt="price"
          />
          <img v-else src="@/assets/swap/minimum.svg" alt="" />
          Minimum receive
        </div>
        <div class="value">
          {{ swapStore?.minimumReceive || "--" }}
          {{ toTokenValue.name }}
        </div>
      </div>
      <div class="group secondary route_div">
        <div class="label">
          <img
            v-if="userStore.isDarkTheme"
            src="@/assets/swap/dark/route.png"
            alt="price"
          />
          <img v-else src="@/assets/swap/route.png" alt="" />
          Route
          <el-popover
            trigger="hover"
            :effect="userStore.isDarkTheme ? 'dark' : 'light'"
          >
            <template #reference>
              <i :class="['iconfont', 'info']"></i>
            </template>
            <template #default>
              The smart contract automatically selects the optimal route to
              complete the swap, ensuring the best exchange rate or the lowest
              slippage.
            </template>
          </el-popover>
        </div>
        <div class="value">
          <img
            v-if="swapStore?.dexName && !['PancakeSwap', 'iZiSwap'].includes(swapStore?.dexName)"
            src="@/assets/swap/uniswap.svg"
            alt=""
          />
          <img
            v-if="swapStore?.dexName && swapStore?.dexName === 'iZiSwap'"
            src="@/assets/swap/iZiSwap.png"
            alt=""
          />
          <img
            v-if="swapStore?.dexName && swapStore?.dexName === 'PancakeSwap'"
            src="@/assets/swap/pancankeswap.png"
            alt=""
          />
          {{ swapStore.inputValue ? `${swapStore.dexName || "--"}` : "--" }}
        </div>
      </div>
      <!-- <img
        :class="['arrow', showConfirm ? 'transfer' : null]"
        @click="showConfirm = !showConfirm"
        src="@/assets/ui3/arrow_right.png"
        alt=""
        v-if="userStore.isDarkTheme"
      />
      <img
        :class="['arrow', showConfirm ? 'transfer' : null]"
        @click="showConfirm = !showConfirm"
        src="@/assets/ui3/light/arrow_right2.png"
        alt=""
        v-else
      /> -->
    </div>
  </div>
  
  <n-carousel
      v-show="userStore.allChains.find((chain) => chain.chainid === swapStore.sourceChainId)"
      class="banner_carousel"
      :interval="6000"
      draggable
      :touchable="true"
      autoplay
      :show-dots="false"
      trigger="hover"
    >
      <div class="share_box share_box_Taiko" @click="toTaikoLink" v-if="userStore.allChains.find(
        (chain) => chain.chainid == swapStore.sourceChainId
      )?.aliasName === 'Taiko'">
        <div class="img_box">
          <img
            :src="
              swapStore.allSourceChains.find(
                (chain) => chain.chain_id == swapStore.sourceChainId
              )?.icon || 'https://owlto.finance/icon/chain/Ethereum.png'
            "
            alt="chain"
          />
        </div>
        <div class="con">
          <div class="top">
            Earn Taiko Points by swapping for
            <span
              :style="`color: ${
                !userStore.isDarkTheme
                  ? networkColor[
                      userStore.allChains.find(
                        (chain) => chain.chainid == swapStore.sourceChainId
                      )?.aliasName || 'Arbitrum'
                    ]?.white
                  : networkColor[
                      userStore.allChains.find(
                        (chain) => chain.chainid == swapStore.sourceChainId
                      )?.aliasName || 'Arbitrum'
                    ]?.black
              }`"
            >
              Free
            </span>
            via Owlto
          </div>
          <div class="bottom">Season 2 of Trailblazers is live! Share 6 million $Taiko tokens</div>
        </div>
        <div class="park_box">
          <img src="@/assets/activityImgV3/park.svg" alt="" />
        </div>
      </div>
      <div class="share_box" @click="toBridgeFn">
        <div class="img_box">
          <img
            :src="
              userStore.allChains.find(
                (chain) => chain.chainid == swapStore.sourceChainId
              )?.icon || 'https://owlto.finance/icon/chain/Ethereum.png'
            "
            alt="chain"
          />
        </div>
        <div class="con">
          <div class="top">
            Bridge assets to
            <span
              :style="`color: ${
                !userStore.isDarkTheme
                  ? networkColor[
                      userStore.allChains.find(
                        (chain) => chain.chainid == swapStore.sourceChainId
                      )?.aliasName || 'Arbitrum'
                    ]?.white
                  : networkColor[
                      userStore.allChains.find(
                        (chain) => chain.chainid == swapStore.sourceChainId
                      )?.aliasName || 'Arbitrum'
                    ]?.black
              }`"
            >
              {{
                userStore.allChains.find(
                  (chain) => chain.chainid == swapStore.sourceChainId
                )?.aliasName || "Arbitrum"
              }}
            </span>
          </div>
          <div class="bottom">Gain Owlto Points and Swap for Free</div>
        </div>
        <div class="park_box">
          <img src="@/assets/activityImgV3/park.svg" alt="" />
        </div>
      </div>
    </n-carousel>

  <BaseModal
    v-show="networkList.show"
    :title="networkList.title"
    :titleBorder="true"
    @close="() => (networkList.show = false)"
  >
    <div class="network">
      <div
        :class="[
          'network-item',
          swapStore.sourceChainId == item.chain_id ? 'active' : '',
        ]"
        v-for="(item, index) in swapStore.allSourceChains"
        :key="index"
        @click="changeNetwork(item)"
      >
          <img :src="item?.icon" :alt="`${item?.alias_name}_icon`" />
          <span>{{item?.alias_name}}</span>
      </div>
    </div>
  </BaseModal>

  <BaseModal
    v-show="slippage.show"
    :title="slippage.title"
    :titleBorder="true"
    @close="() => (slippage.show = false)"
  >
    <div class="slippage">
      <div class="head">
        <span>Slippage</span>
        <span>{{
          swapStore.slippageInput
            ? `${swapStore.slippageInput}%`
            : slippageList[slippageNavIndex].label || "Auto"
        }}</span>
      </div>
      <div class="nav">
        <div
          :class="['item', index === slippageNavIndex ? 'active' : '']"
          v-for="(item, index) in slippageList"
          :key="index"
          @click="changeSlippage(item, index)"
        >
          {{ item.label }}
        </div>
        <div
          :class="[
            'input',
            Number(swapStore.slippageInput) > 0 ? 'active' : '',
          ]"
        >
          <input
            type="text"
            placeholder="Custom"
            v-model="swapStore.slippageInput"
            @input="slippageInputFormatHandle"
            maxlength="6"
          />
        </div>
      </div>
      <div class="tip" v-show="Number(swapStore.slippageNumerator) < 0.05">
        Slippage below 0.05% may result in an expired order.
      </div>
    </div>
  </BaseModal>

  <BaseModal
    v-show="tokenList.show"
    :title="tokenList.title"
    :titleBorder="true"
    @close="closetTokenList"
  >
    <div
      class="tokens"
      v-loading="tokenListLoading"
      element-loading-background="rgba(0, 0, 0, 0)"
    >
      <div
        class="background"
        v-show="tokenList.showNetworkList"
        @click="tokenList.showNetworkList = false"
      ></div>
      <div class="tokens-head">
        <div class="search">
          <img src="@/assets/icon/search.png" alt="" />
          <input
            type="text"
            v-model="swapStore.inputSearchToken"
            placeholder="Search by token or address"
          />
        </div>
        <div
          class="select"
          @click.prevent="
            tokenList.showNetworkList = !tokenList.showNetworkList
          "
        >
          <img
            :src="
              swapStore.allSourceChains.find(
                (chain) => chain.chain_id == swapStore.sourceChainId
              )?.icon
            "
            alt=""
          />
          <img
            v-if="userStore.isDarkTheme"
            src="@/assets/ui3/arrow_right.png"
            alt=""
          />
          <img v-else src="@/assets/ui3/light/arrow_right2.png" alt="" />
          <div class="networkList" v-show="tokenList.showNetworkList">
            <div
              class="item"
              @click.stop="changeNetwork(item)"
              v-for="(item, index) in swapStore.allSourceChains"
              :key="index"
            >
              <img
                :src="
                  swapStore.allSourceChains.find(
                    (chain) => chain.chain_id == item.chain_id
                  )?.icon
                "
                alt=""
              />
              <span>{{
                swapStore.allSourceChains.find(
                  (chain) => chain.chain_id == item.chain_id
                )?.alias_name
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="tokens-box">
        <div
          class="token"
          v-for="(item, index) in searchPopularTokens.length && swapStore.inputSearchToken ? searchPopularTokens : tokenListMap[swapStore.allSourceChains.find((chain) => chain.chain_id == (chainId || swapStore.sourceChainId))?.name]?.filter(
            (token) =>
              token.name
                .toLocaleLowerCase()
                .includes(swapStore.inputSearchToken.toLocaleLowerCase()) ||
              token.address
                .toLocaleLowerCase()
                .includes(swapStore.inputSearchToken.toLocaleLowerCase())
          )"
          @click="changeToken(item)"
          :key="index"
        >
          <div class="left">
            <div class="token-img">
              <img
                v-if="item.icon"
                :src="item.icon"
                alt=""
              />
              <img v-else src="@/assets/swap/default.png" alt="" />
            </div>
            <div class="token-content">
              <span>{{ item.name }}</span>
              <span>{{ formatUserId(item.address, 4) }}</span>
            </div>
            <!-- <div class="network-img">
              <img
                :src="
                  userStore.allChains.find(
                    (chain) => chain.chainid == swapStore.sourceChainId
                  )?.icon
                "
                alt=""
              />
            </div> -->
          </div>
          <div class="right" v-if="swapAccount.status">
            {{
              swapStore.balanceList.find((token) => token.name === item.name)
                ?.balance !== ""
                ? getToFixed(
                    BigNumber(
                      swapStore.balanceList.find(
                        (token) => token.name === item.name
                      )?.balance || "0"
                    )
                      .div(
                        10 **
                          (item.decimals || 0)
                      )
                      .toFixed(6)
                  )
                : ""
            }}
            <!-- {{ item.name }} -->
          </div>
        </div>
      </div>
    </div>
  </BaseModal>

  <SwapCompleted
    :show="completed.show"
    :fromValue="completed.fromValue"
    :toValue="completed.toValue"
    :status="completed.status"
    @close="
      () => {
        completed.show = false;
        if (completed.status === 1) clearNumber();
      }
    "
  />

  <BaseModal
    v-show="showConfirmation"
    title="Review"
    :titleBorder="true"
    @close="() => (showConfirmation = false)"
  >
    <div class="confirmation_box">
      <div class="top_box">
        <div class="chain_information">
          <div class="left">
            <div class="img_box">
              <img class="img_token" :src="fromTokenValue.icon" alt="" />
              <img
                class="img_network"
                :src="
                  swapStore.allSourceChains.find(
                    (chain) => chain.chain_id == swapStore.sourceChainId
                  )?.icon
                "
                alt="chain"
              />
            </div>
            <div class="box_value">
              <div class="value_token">{{ fromTokenValue.name }}</div>
              <div class="value_network">
                {{
                  swapStore.allSourceChains.find(
                    (chain) => chain.chain_id == swapStore.sourceChainId
                  )?.alias_name
                }}
              </div>
            </div>
          </div>

          <div class="right">
            <div class="number">{{ swapStore.inputValue }}</div>
            <div class="parice">~${{ swapStore.fromPrice }}</div>
          </div>
        </div>

        <div class="arrow_box">
          <div class="img_box">
            <img src="@/assets/swap/arrow.svg" alt="" />
          </div>
        </div>

        <div class="chain_information">
          <div class="left">
            <div class="img_box">
              <img class="img_token" :src="toTokenValue.icon" alt="" />
              <img
                class="img_network"
                :src="
                  swapStore.allSourceChains.find(
                    (chain) => chain.chain_id == swapStore.sourceChainId
                  )?.icon
                "
                alt="chain"
              />
            </div>
            <div class="box_value">
              <div class="value_token">{{ toTokenValue.name }}</div>
              <div class="value_network">
                {{
                  swapStore.allSourceChains.find(
                    (chain) => chain.chain_id == swapStore.sourceChainId
                  )?.alias_name
                }}
              </div>
            </div>
          </div>

          <div class="right">
            <div :class="['number', { number_disabled: !swapStore.toValue }]">
              {{ swapStore.toValue || "Loading" }}
            </div>
            <div class="parice">~${{ swapStore.priceByToValue }}</div>
          </div>
        </div>
      </div>

      <div class="bottom_box">
        <div class="rate_box">
          <div class="left">Rate</div>
          <div class="right">
            1 {{ fromTokenValue.name }} ≈
            {{ formatDecimal(swapStore.amountOut, 2) }}
            {{ toTokenValue.name }}
          </div>
        </div>
        <div class="networkFee_box" v-if="getShowConfirm() && !['PancakeSwap', 'iZiSwap'].includes(swapStore?.dexName)">
          <div class="left">Network gas fee</div>
          <div class="right">
            <img
              v-if="userStore.isDarkTheme"
              src="@/assets/swap/dark/gas.png"
              alt="price"
            />
            <img v-else src="@/assets/swap/gas.png" alt="" />
            {{
              swapStore.gasEstimateUsd ? `$${swapStore.gasEstimateUsd}` : "--"
            }}
          </div>
        </div>
        <div class="slippage_box" v-if="getShowConfirm()">
          <div class="left">Slippage</div>
          <div class="right">
            {{
              swapStore.slippageInput
                ? `${swapStore.slippageInput}%`
                : slippageList[slippageNavIndex].label || "Auto"
            }}
          </div>
        </div>
        <div class="minimum_receive" v-if="getShowConfirm()">
          <div class="left">Minimum receive</div>
          <div class="right">
            {{ swapStore?.minimumReceive || "--" }}
            {{ toTokenValue.name }}
          </div>
        </div>
      </div>

      <div class="division" v-if="!swapLoading"></div>
      
      <div class="countdown_box" v-if="getShowConfirm() && !swapLoading">
        Quote expires in 
        <span style="color: #f4c237;font-weight: 700;" v-if="!swapLoading">{{ timeCount }}s</span>
        <TextLoading class="btn-loading" v-show="swapLoading" />
      </div>

      <div class="btn_box">
        <div
          :class="['swap-submit', { disabled: initQuotesLoading }]"
          @click="initQuotesLoading ? () => {} : swapHandle()"
        >
          {{ confirmSwapText }}
          <TextLoading class="btn-loading" v-show="swapLoading" />
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { computed, ref } from "vue";
import useStore from "@/store";
import _ from "lodash";
import { VersionedTransaction } from "@solana/web3.js";
import { request2 } from "@/api/request";
import BigNumber from "bignumber.js";
import {
  formatUserId,
  debounce,
  getToFixed,
  getSwapImg,
} from "@/common/function";
import bus from "@/bus";
import { createPublicClient, http } from "viem";
import moment from "moment";
import { myElNotification } from "@/components/ElNotification/myElNotification.js";
import {
  watchAccount,
  getAccount,
  connect,
  sendTransaction,
  switchChain,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { wagmiConfig } from "@/wagmi";
import { nextTick, onUnmounted, reactive } from "vue";
import SwapCompleted from "./children/SwapCompleted.vue";
import { useRouter, useRoute } from "vue-router";
import CarouselContainer from "./children/carouselContainer.vue";
import { walletList } from "@/components/header/walletList";
const router = useRouter();
const route = new useRoute();
const store = useStore();
const {
  useSwapStore,
  useUserStore,
  useWalletStore,
  useSolanaStore
} = store;
const userStore = useUserStore;
const swapStore = useSwapStore;
const walletStore = useWalletStore;
const solanaStore = useSolanaStore;
const showConfirm = ref(false);
const initQuotesLoading = ref(false);
const showConfirmation = ref(false);
const approveFnLoading = ref(false);
const approveBackupHash = ref("");
const contract_calls_backup = ref([]);
const quotesBackup = ref([]);
const confirmSwapText = ref("Confirm swap");
const transactionErrorMessage = ref("");
const approveTx = reactive({
  contract: "",
  calldata: "",
  value: "",
});
const tokenListLoading = ref(false);
//{sourceCHainId: [{}],sourceCHainId: [{}]}
const searchPopularTokens = ref([]);
const searchBalanceList = {};
const tokenListMap = {};
const chaninTokenMap = {};
let fromTokenValue = reactive({
  address: "",
  decimals: 0,
  icon: "",
  name: "",
});
let toTokenValue = reactive({
  address: "",
  decimals: 0,
  icon: "",
  name: "",
});

const popularTokens = ref([]);

const swapChainWalletTag = computed(() => {
  if (swapStore.sourceChainId === "83797601") {
    return 'Solana';
  } else {
    return 'EVM';
  }
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

const networkColor = {
  Ethereum: {
    white: "#4F4F4F",
    black: "#F7F7F7",
  },
  Polygon: {
    white: "#8339CD",
    black: "#8339CD",
  },
  "BNB Chain": {
    white: "#EABC4E",
    black: "#EABC4E",
  },
  Optimism: {
    white: "#EA3431",
    black: "#EA3431",
  },
  Arbitrum: {
    white: "#4095E5",
    black: "#4095E5",
  },
  Base: {
    white: "#2151F5",
    black: "#2151F5",
  },
  Blast: {
    white: "rgb(200 201 41)",
    black: "#fcfe07",
  },
  Scroll: {
    white: "#e3c7a8",
    black: "#d2bea8",
  },
  Taiko: {
    white: "#e91898",
    black: "#e91898",
  },
  Kroma: {
    white: "#80e244",
    black: "#80e244",
  }
};

let interval;
BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN });

const networkList = reactive({
  show: false,
  title: "Network",
});

const slippage = reactive({
  show: false,
  title: "Setting",
});

const tokenList = reactive({
  show: false,
  title: "Select Token",
  showNetworkList: false,
  position: "from",
});

const completed = reactive({
  show: false,
  title: "",
  status: 0,
  fromValue: "",
  toValue: "",
});

const slippageNavIndex = ref(0);
const slippageList = ref([
  {
    label: "Auto",
    value: 1,
  },
  {
    label: "0.1%",
    value: 0.1,
  },
  {
    label: "0.5%",
    value: 0.5,
  },
  {
    label: "1%",
    value: 1,
  },
]);

const loadingByClick = ref(false);
const initQuotesByLoading = debounce(async () => {
  if (loadingByClick.value) return;
  loadingByClick.value = true;
  await initQuotes();
  loadingByClick.value = false;
}, 50);

const closetTokenList = () => {
  tokenList.show = false;
  searchPopularTokens.value = []; 
  swapStore.inputSearchToken = '';
  tokenList.showNetworkList = false;
};

const balanceLoading = ref(false);
const initBalance = async () => {
  try {
    if (!swapAccount.value.status) return;
    balanceLoading.value = true;

    const { code, data } = await request2({
      method: "GET",
      url: "/swap_auxiliary_api/v1/user_balances",
      params: {
        user: swapAccount.value.address,
        chain_name:
          userStore.allChains.find(
            (chain) => chain.chainid == (swapStore?.sourceChainId || "42161")
          )?.name || "EthereumMainnet",
      },
    });

    if (code !== 0) return;
    let list = [];
    for (let i = 0; i < popularTokens.value.length; i++) {
      const item = popularTokens.value[i];
      const index = data.findIndex((v) => v.name === item.name);
      if (index !== -1) {
        list.push(data[index]);
        popularTokens.value.usd_value = data[index].usd_value;
      } else {
        popularTokens.value.usd_value = "0";
      }
    }
    swapStore.balanceList = list;
    // popularTokens.value.map(item => {
    // })
    // swapStore.balanceList = _.uniqBy(
    //   [...data, ...swapStore.balanceList],
    //   "name"
    // );
  } catch (error) {
    console.log("error", error);
  } finally {
    balanceLoading.value = false;
  }
};

const openConfirmation = async () => {
  try {
    if (!swapAccount.value.status) {
      bus.$emit("onHomeWallet", swapChainWalletTag);
      return;
    }
    if (swapStore.sourceChainId !== "83797601") {
      const account = await getAccount(wagmiConfig);

      if (account.chainId != swapStore.sourceChainId) {
        await switchChain(wagmiConfig, {
          chainId: Number(swapStore.sourceChainId),
        });
      }
    } else {
      await solanaStore.update("Phantom");
    }
    setIntervalFn();
    showConfirmation.value = true;
  } catch (error) {
    console.log("error", error);
  }
};

const maxInputHandle = debounce(async () => {
  const token = fromTokenValue;
  const fromBalance = trimTrailingZeros(
    getToFixed(
      BigNumber(
        swapStore.balanceList.find(
          (token) => token.name === fromTokenValue.name
        )?.balance || "0"
      )
        .div(
          10 **
            (fromTokenValue.decimals || "0")
        )
        .toFixed(6)
    )
  );

  if (isNativeToken(token.address)) {
    if (fromBalance <= 0.00001) {
      return (swapStore.inputValue = 0);
    }
    // swapStore.inputValue = BigNumber(fromBalance).minus(0.00001).toString();
    await setFromTokenValue(BigNumber(fromBalance).minus(0.00001).toString());
  } else {
    swapStore.inputValue = fromBalance;
  }
}, 150);

const isNativeToken = (address) => {
  let nativeToken = ["0x0000000000000000000000000000000000000000"];
  return nativeToken.includes(address);
};

const setFromTokenValue = async (inputValue) => {
  try {
    const token = fromTokenValue;
    // const amount = BigNumber(inputValue)
    //   .times(10 ** token.decimals)
    //   .toFixed();
    const amount = swapStore.balanceList.find(
      (token) => token.name === fromTokenValue.name
    )?.balance;
    const result = await request2({
      method: "POST",
      url: "/swap_api/v1/estimate_tx_fee",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        source_chain_id: swapStore.sourceChainId,
        target_chain_id: swapStore.sourceChainId,
        token_in: fromTokenValue,
        token_out: toTokenValue,
        slippage: BigNumber(swapStore.slippageNumerator).div(100).toString(),
        amount,
      },
    });
    if (result.code === 0) {
      const { gas_estimate_wei } = result.data[0];
      if (gas_estimate_wei) {
        swapStore.inputValue = BigNumber(amount)
          .minus(BigNumber(gas_estimate_wei))
          .div(10 ** token.decimals);
      } else {
        swapStore.inputValue = inputValue;
      }
    }
  } catch (error) {
    console.log("error", error);
  }
};

const formatDecimal = (numStr, num) => {
  let value = numStr.toString();

  let [integerPart, decimalPart] = value.split(".");
  if (!decimalPart) return value;

  let result = "";
  let result2 = "";
  let count = 0;
  for (let i = 0; i < decimalPart.length; i++) {
    result += decimalPart[i];
    if (decimalPart[i] !== "0") count++;
    if (i < num) {
      result2 += decimalPart[i];
    }
    if (count === num) break;
  }

  if (integerPart !== "0") {
    return `${integerPart}.${result2}`;
  }
  return result.length > 0 ? `${integerPart}.${result}` : integerPart;
};

const toBridgeFn = () => {
  const aliasName =
    userStore.allChains.find(
      (chain) => chain.chainid == swapStore.sourceChainId
    )?.aliasName || "Arbitrum";
  let name = aliasName === "Arbitrum" ? "ArbitrumOne" : aliasName;
  if (aliasName === "BNB Chain") name = "BNBchain";
  // bus.$emit("changeBridgePage", "bridge");
  router.push(`/?to=${name}`);
};

const toTaikoLink = () => {
  window.open("https://trailblazers.taiko.xyz/profile", "_blank");
}

const changeSlippage = async (item, index) => {
  // slippage.show = false;
  slippageNavIndex.value = index;
  swapStore.slippageNumerator = item.value;
  swapStore.slippageInput = "";
};

const changeNetwork = async (item) => {
  swapStore.sourceChainId = item.chain_id;
  networkList.show = false;
  tokenList.showNetworkList = false;
  clearNumber();
  // popularTokens.value =
  //   tokenListMap[item.name]?.map((item) => {
  //     // if (item.name === swapStore.tokenInName || item.name === swapStore.tokenOutName) {
  //     //   queryBalancesFn(item);
  //     // }
  //     return {
  //       ...item,
  //       icon: item?.icon || getSwapImg("default.png"),
  //       usd_value: "0",
  //     };
  //   }) || [];
  queryBalancesFn();
  switchToken(item);
  // await initPopularTokens(item.chain_id);
  // if (searchPopularTokens[swapStore.sourceChainId]) {
  //   searchPopularTokens[swapStore.sourceChainId].map((v) => {
  //     insertIntoSortedArray(popularTokens.value, v);
  //   });
  // }
  // if (searchBalanceList[swapStore.sourceChainId]) {
  //   searchBalanceList[swapStore.sourceChainId].map((v) => {
  //     swapStore.balanceList.push(v);
  //   });
  // }
  // await initBalance();
  await initQuotes();
};

const switchToken = (item) => {
  const pair = item.default_tokens.map((token) =>
    token.name.toLocaleLowerCase()
  );

  if (!pair.includes(fromTokenValue.name)) {
    const fromToken = item.default_tokens.filter(
      (token) => token.name !== fromTokenValue.name
    )[0];
    Object.keys(fromToken).map((v) => {
      fromTokenValue[v] = fromToken[v];
    });
    queryBalancesFn(fromToken);
  }

  if (!pair.includes(toTokenValue.name)) {
    const toToken = item.default_tokens.filter(
      (token) => token.name !== fromTokenValue.name
    )[0];
    Object.keys(toToken).map((v) => {
      toTokenValue[v] = toToken[v];
    });
    queryBalancesFn(toToken);
  }
};

const changeToken = async (item) => {
  const action = tokenList.position;
  if (action === "from") {
    if (toTokenValue.name === item.name) {
      swapPair();
      return
    }
    Object.keys(item).map(v => {
      fromTokenValue[v] = item[v];
    })
  } else if (action === "to") {
    if (fromTokenValue.name === item.name) {
      swapPair();
      return
    }
    Object.keys(item).map(v => {
      toTokenValue[v] = item[v];
    })
  }
  clearNumber();
  initQuotes();
  // initBalance();
  queryBalancesFn(item);
  tokenList.show = false;
};

// const unwatch = watchAccount(wagmiConfig, {
// async onChange(account) {
// if (account.isConnected && !swapLoading.value) {
// clearNumber();
// await initPopularTokens(undefined, 'init');
// await initBalance();
// }
// },
// });

const swapPair = async () => {
  const fromCache = JSON.parse(JSON.stringify(fromTokenValue));
  const toCache = JSON.parse(JSON.stringify(toTokenValue));
  Object.keys(toCache).map(item => {
    fromTokenValue[item] = toCache[item];
  });
  Object.keys(fromCache).map((item) => {
    toTokenValue[item] = fromCache[item];
  });
  if (swapStore.toValue) {
    swapStore.inputValue = swapStore.toValue;
    fromValueFormatHandle();
  }
  if (!swapStore.inputValue) {
    swapStore.amountOut = '';
    swapStore.fromTokenPrice = '0';
    debounceInitQuotes();
  }
};

const debounceInitQuotes = debounce(() => {
  initQuotes();
}, 1000);

let timeCount = ref(30);
let timeInterval;
let timeInterval1;
const setIntervalFn = () => {
  clearIntervalFn();
  timeCount.value = 30;

  timeInterval1 = setInterval(() => {
    if (timeCount.value > 0) {
      timeCount.value--;
    }
    if (timeCount.value === 0) {
      clearInterval(timeInterval1);
    }
  }, 1000);

  interval = setInterval(async () => {
    if (timeInterval) clearInterval(timeInterval);
    if (timeInterval1) clearInterval(timeInterval1);
    timeCount.value = 30;
    timeInterval = setInterval(() => {
      if (timeCount.value > 0) {
        timeCount.value--;
      }
    }, 1000);
    await initQuotes();
  }, 30 * 1000);
};

const clearIntervalFn = () => {
  if (interval) clearInterval(interval);
  if (timeInterval1) clearInterval(timeInterval1);
  if (timeInterval) clearInterval(timeInterval);
}

onMounted(async () => {
  if (route?.query?.chainId) {
    swapStore.sourceChainId = route?.query?.chainId;
  }
  init();
});

onUnmounted(() => {
  clearIntervalFn();
});

watch(
  () => userStore.owltoFinanceUserId,
  () => {
    init();
  }
);

const init = async () => {
  // setIntervalFn();

  clearNumber();
  // initBalance();
  await initSourcesChains(swapStore.sourceChainId);
  // await initPopularTokens();
  // initQuotes();
};

const clearNumber = () => {
  swapStore.inputValue = "";
  swapStore.slippageInput = "";
  swapStore.toValue = "";
  swapStore.slippageNumerator = 5;
  swapStore.inputSearchToken = "";
  transactionErrorMessage.value = "";
  approveBackupHash.value = "";
};

const verifyContractFn = async (chain_name, contract) => {
  try {
    const { code, data } = await request2({
      method: "GET",
      url: "/swap_api/v1/check_router",
      params: {
        chain_name,
        router: contract,
      },
    });
    if (code === 0 && data?.is_valid) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("error", error);
    return false;
  }
};

const swapLoading = ref(false);
const swapHandle = async () => {
  clearIntervalFn();
  swapStore.tokenInName = fromTokenValue.name;
  swapStore.tokenOutName = toTokenValue.name;
  try {
    swapLoading.value = true;
    if (!swapAccount.value.status) {
      bus.$emit("onHomeWallet", swapChainWalletTag.value);
      return;
    }

    if (swapStore.sourceChainId !== "83797601") {
      const account = await getAccount(wagmiConfig);

      if (account.chainId != swapStore.sourceChainId) {
        await switchChain(wagmiConfig, {
          chainId: Number(swapStore.sourceChainId),
        });
      }
    } else {
      await solanaStore.update("Phantom");
    }

    await getApproveInformation();
    if (!contract_calls_backup?.value?.length) {
      return;
    }

    completed.toValue = swapStore.toValue;
    completed.fromValue = swapStore.inputValue;

    let tx = contract_calls_backup.value[0];
    if (contract_calls_backup.value.length === 2) {
      tx = contract_calls_backup.value[1];
    }

    const verifyContract = await verifyContractFn(
      swapStore.allSourceChains.find(
        (chain) => chain.chain_id == swapStore.sourceChainId
      )?.name,
      tx.contract
    );

    if (!verifyContract) {
      ElNotification({
        showClose: true,
        title: `contract error`,
        type: "error",
        offset: 80,
        duration: 8000,
      });
      return;
    }

    confirmSwapText.value = "Confirm in your wallet";
    let transferHash;
    // console.log(gasEstimate);
    if (swapStore.sourceChainId !== "83797601") {
      const params = {
        to: tx.contract,
        data: tx.calldata,
        value: tx.value,
      };
      if (tx?.gas_limit && tx.gas_limit != "0") {
        params.gas = BigInt(tx?.gas_limit || "0");
      }
      transferHash = await sendTransaction(wagmiConfig, params);
    } else if (swapStore.sourceChainId === "83797601") {
      const provider = solanaStore.getProvider();
      const buffer = Buffer.from(tx.calldata, 'hex');
      const transaction = VersionedTransaction.deserialize(buffer);
      const responseTx = await provider.signAndSendTransaction(transaction);
      transferHash = responseTx.signature;
    }
    swapStore.fromHash = transferHash;
    // completed.show = true;
    // showConfirmation.value = false;
    // completed.status = 0;

    confirmSwapText.value = "Swapping";

    while (true) {
      const { code, data } = await request2({
        method: "GET",
        url: "/swap_auxiliary_api/v1/src_tx_status",
        params: {
          tx_hash: swapStore.fromHash,
          chain_name: swapStore.allSourceChains.find(
            (chain) => chain.chain_id == swapStore.sourceChainId
          )?.name,
        },
      });
      swapStore.popularTokens.push(
        {
          name: fromTokenValue.name,
          icon: fromTokenValue?.icon || getSwapImg("default.png"),
        },
        {
          name: toTokenValue.name,
          icon: toTokenValue?.icon || getSwapImg("default.png"),
        }
      );
      if (data.status === "success") {
        completed.show = true;
        showConfirmation.value = false;
        completed.status = 1;
        ElNotification({
          showClose: true,
          title: `Swapped ${swapStore.inputValue} ${fromTokenValue.name} to ${swapStore.toValue} ${toTokenValue.name}`,
          type: "success",
          offset: 80,
          duration: 8000,
        });
        break;
      } else if (data.status === "failed") {
        completed.show = true;
        showConfirmation.value = false;
        completed.status = 2;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
    console.log("contract_calls1", transferHash);
  } catch (err) {
    window.alert("in catch, err=" + err.message);
    completed.show = false;
    console.log(err.message);
    if (err?.shortMessage?.includes("rejected the request")) {
      setIntervalFn();
      ElNotification({
        showClose: true,
        title: `User rejected the transaction`,
        type: "error",
        offset: 80,
        duration: 8000,
      });
    }
    if (err?.shortMessage?.include("reverted for an unknown reason")) {
      completed.show = true;
      showConfirmation.value = false;
      completed.status = 2;
      transactionErrorMessage.value =
        "Try adjusting slippage to a higher value.";
    }
  } finally {
    confirmSwapText.value = "Confirm swap";
    // initBalance();

    queryBalancesFn();
    swapLoading.value = false;
    // setIntervalFn();
  }
};

const judgeApproveFn = async () => {
  if (swapStore.sourceChainId === "83797601") {
    return;
  }
  try {
    initQuotesLoading.value = true;
    const token = fromTokenValue;
    const amount = BigNumber(swapStore.inputValue)
      .times(10 ** token.decimals)
      .toFixed();
    const { code, data } = await request2({
      method: "POST",
      url: "/swap_api/v1/check_allowance",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        token: {
          name: fromTokenValue.name,
          address: token.address,
          decimals: token.decimals,
        },
        chain_name: swapStore.allSourceChains.find(
          (chain) => chain.chain_id == swapStore.sourceChainId
        )?.name,
        user: swapAccount.value.address,
        amount,
      },
    });
    if (code === 0 && data?.approve_contract) {
      inputStatus.value = 3;
      approveTx.contract = data?.approve_contract?.contract || "";
      approveTx.calldata = data?.approve_contract?.calldata || "";
      approveTx.value = data?.approve_contract?.value || "";
    } else {
      inputStatus.value = 1;
    }
  } catch (error) {
    console.log("error", error);
  } finally {
    initQuotesLoading.value = false;
  }
};

const getPriceFn = async () => {
  try {
    const tokenInObj = fromTokenValue;
    const tokenOutObj = toTokenValue;
    const priceRes = await request2({
      method: "POST",
      url: "/swap_api/v1/usd_prices",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        tokens: [
          {
            name: tokenInObj.name,
            address: tokenInObj.address,
            decimals: tokenInObj.decimals,
          },
          {
            name: tokenOutObj.name,
            address: tokenOutObj.address,
            decimals: tokenOutObj.decimals,
          },
        ],
        chain_name: swapStore.allSourceChains.find(
          (chain) => chain.chain_id == swapStore.sourceChainId
        )?.name,
      }),
    });

    if (priceRes.code === 0) {
      swapStore.fromTokenPrice = priceRes.data[0]?.usd_price || 0;
      swapStore.toTokenPrice = priceRes.data[1]?.usd_price || 0;
    }

    swapStore.fromPrice =
      BigNumber(swapStore.fromTokenPrice)
        .times(swapStore.inputValue || 0)
        .toFixed(2) || 0;
    swapStore.priceByToValue =
      BigNumber(swapStore.toTokenPrice).times(swapStore.toValue).toFixed(2) ||
      0;
  } catch (error) {
    console.log("error", error);
  }
};

const getApproveInformation = async () => {
  contract_calls_backup.value = [];
  quotesBackup.value = [];
  try {
    initQuotesLoading.value = true;
    const token = fromTokenValue;
    const amount = BigNumber(swapStore.inputValue)
      .times(10 ** token.decimals)
      .toFixed();
    const { code, data } = await request2({
      method: "POST",
      url: "/swap_api/v1/make_swap",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        source_chain_id: swapStore.sourceChainId,
        target_chain_id: swapStore.sourceChainId,
        user: swapAccount.value.address,
        recipient: swapAccount.value.address,
        token_in: fromTokenValue,
        token_out: toTokenValue,
        slippage: BigNumber(swapStore.slippageNumerator).div(100).toString(),
        amount,
        // tradeType: "EXACT_IN",
        channel: 98675412,
      },
    });
    if (code !== 0) return;
    const { contract_calls, quotes } = data;
    contract_calls_backup.value = contract_calls;
    quotesBackup.value = quotes;
  } catch (error) {
    console.log("error", error);
    ElNotification({
      showClose: true,
      title: `make_swap error`,
      type: "error",
      offset: 80,
      duration: 8000,
    });
  } finally {
    initQuotesLoading.value = false;
  }
};

const approveFn = async () => {
  clearIntervalFn();
  try {
    inputStatus.value = 5;
    approveFnLoading.value = true;
    if (!swapAccount.value.status) {
      bus.$emit("onHomeWallet");
      return;
    }

    const account = await getAccount(wagmiConfig);

    if (account.chainId != swapStore.sourceChainId) {
      await switchChain(wagmiConfig, {
        chainId: Number(swapStore.sourceChainId),
      });
    }

    // await getApproveInformation();

    approveBackupHash.value = "";
    // const approveTx = contract_calls_backup.value[0];
    const approveHash = await sendTransaction(wagmiConfig, {
      to: approveTx.contract,
      data: approveTx.calldata,
      value: approveTx.value,
    });
    while (true) {
      const { code, data } = await request2({
        method: "GET",
        url: "/swap_auxiliary_api/v1/tx_status",
        params: {
          tx_hash: approveHash,
          chain_name: swapStore.allSourceChains.find(
            (chain) => chain.chain_id == swapStore.sourceChainId
          )?.name,
        },
      });
      if (data === "success") {
        inputStatus.value = 1;
        approveBackupHash.value = approveHash;
        ElNotification({
          showClose: true,
          title: `${fromTokenValue.name} approval request submitted`,
          type: "success",
          offset: 80,
          duration: 8000,
        });
        initQuotes();
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  } catch (error) {
    inputStatus.value = 3;
    if (error.shortMessage.includes("User rejected the request")) {
      ElNotification({
        showClose: true,
        title: "User rejected the transaction",
        type: "error",
        offset: 80,
        duration: 8000,
      });
    }
    console.log("error", error.message);
  } finally {
    approveFnLoading.value = false;
    setIntervalFn();
  }
};

const fromValueFormatHandle = () => {
  swapStore.toValue = "";
  approveBackupHash.value = "";
  swapStore.priceByToValue = "";
  swapStore.inputValue = swapStore.inputValue
    .toString()
    .replace(/\.{2,}/g, ".")
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace(/-/g, "")
    .replace("$#$", ".")
    .replace(/[^\d.]/g, "");
};

const slippageInputFormatHandle = () => {
  swapStore.slippageInput = swapStore.slippageInput
    .toString()
    .replace(/\.{2,}/g, ".")
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace(/-/g, "")
    .replace("$#$", ".")
    .replace(/[^\d.]/g, "");
};

let checkAmountId = 0;
const initQuotes = async (v) => {
  // swapStore.fromPrice = 0;
  // swapStore.priceByToValue = 0;
  swapStore.gasEstimateUsd = "";
  swapStore.dexName = "";
  swapStore.amountOut = "";
  if (!swapStore.inputValue) {
    inputStatus.value = 1;
  }

  const value = v || swapStore.inputValue || 1;
  checkAmountId += 1;
  const computedId = checkAmountId;
  let code = -1,
    data = null;
  const token = fromTokenValue;

  try {
    if (!swapStore.inputValue) {
      initQuotesLoading.value = true;
    }
    const amount = BigNumber(value)
      .times(10 ** token.decimals)
      .toFixed();
    const result = await request2({
      method: "POST",
      url: "/swap_api/v1/quotes",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        source_chain_id: swapStore.sourceChainId,
        target_chain_id: swapStore.sourceChainId,
        token_in: fromTokenValue,
        token_out: toTokenValue,
        slippage: BigNumber(swapStore.slippageNumerator).div(100).toString(),
        amount,
      },
    });
    getPriceFn();
    code = result.code;
    data = result.data;
  } catch (err) {
  } finally {
    swapStore.fromTokenPrice = 0;
    // swapStore.toTokenPrice = 0;
    if (checkAmountId !== computedId) return;
    if (code === 3) {
      inputStatus.value = 4;
      return;
    }
    if (code !== 0) {
      swapStore.toValue = "";
      return;
    }
    const {
      amount_out,
      transaction_fee_usd,
      source_chain,
      source_chain_info,
      token_in,
      token_out,
      minimal_amount_out,
    } = data[0];

    const tokenIn = fromTokenValue;
    const tokenout = toTokenValue;
    const chain = swapStore.allSourceChains.find((chain) => chain.chain_id == swapStore.sourceChainId);
    if (tokenIn && tokenout && source_chain_info) {
      if (
        token_in.address !== tokenIn.address ||
        token_out.address !== tokenout.address ||
        source_chain_info.name != chain.name
      ) {
        initQuotes();
        return;
      }
    }

    const dstToken = toTokenValue;
    swapStore.dexName = source_chain.DexName;
    swapStore.amountOut =
      BigNumber(amount_out)
        .div(10 ** dstToken.decimals)
        .div(value)
        .toFixed(8) || 0;
    swapStore.gasEstimateUsd = formatDecimal(transaction_fee_usd || 0, 2);
    swapStore.minimumReceive =
      BigNumber(minimal_amount_out || 0)
        .div(10 ** dstToken.decimals)
        .toFixed(8) || 0;
    if (Number(swapStore.inputValue || 0)) {
      swapStore.toValue = trimTrailingZeros(
        BigNumber(amount_out || "0")
          .div(10 ** (dstToken.decimals || 0))
          .toFixed(8) || 0
      );
      swapStore.priceByToValue =
        BigNumber(swapStore.toTokenPrice).times(swapStore.toValue).toFixed(2) ||
        0;
    }

    if (swapStore.inputValue) {
      const balance = getToFixed(
        BigNumber(
          swapStore.balanceList.find(
            (token) => token.name === fromTokenValue.name
          )?.balance || "0"
        )
          .div(
            10 **
              (fromTokenValue.decimals || '0')
          )
          .toFixed()
      );
      if (Number(value) > Number(balance)) {
        inputStatus.value = 2;
      } else if (amount_out === "0") {
        inputStatus.value = 4;
        return (initQuotesLoading.value = false);
      } else {
        inputStatus.value = 1;
      }
      if (
        inputStatus.value === 1 &&
        inputStatus.value != 2 &&
        swapStore.inputValue
      ) {
        // await getApproveInformation();
        await judgeApproveFn();
      }
    }
    initQuotesLoading.value = false;
  }
};

const trimTrailingZeros = (numStr) => {
  if (
    isNaN(numStr) ||
    typeof numStr !== "string" ||
    !/^\d+(\.\d+)?$/.test(numStr)
  ) {
    return "0";
  }
  if (!/^\d+(\.\d+)?$/.test(numStr)) {
    throw new Error("Invalid number string");
  }

  if (!numStr.includes(".")) {
    return numStr;
  }

  return numStr.replace(/(\.\d*?[1-9])?0+$/, "$1").replace(/\.$/, "");
};

const getShowConfirm = () => {
  if (showConfirm.value) {
    return true;
  }
  if (
    (fromTokenValue.name === "ETH" && toTokenValue.name === "WETH") ||
    (fromTokenValue.name === "WETH" && toTokenValue.name === "ETH")
  ) {
    return false;
  }
  if (
    (fromTokenValue.name === "BNB" && toTokenValue.name === "WBNB") ||
    (fromTokenValue.name === "WBNB" && toTokenValue.name === "BNB")
  ) {
    return false;
  }
  if (
    (fromTokenValue.name === "MATIC" && toTokenValue.name === "WMATIC") ||
    (fromTokenValue.name === "WMATIC" && toTokenValue.name === "MATIC")
  ) {
    return false;
  }
  if (swapStore.toValue) {
    return true;
  }
  return false;
};

const watchSlippageInput = (v) => {
  if (Number(v) <= 0) {
    slippageNavIndex.value = 0;
    return;
  }
  slippageNavIndex.value = -1;
  swapStore.slippageNumerator = v;
  initQuotes();
};

const inputLoading = ref(false);
const inputStatus = ref(0);
const inputText = ref([
  "Swap",
  "Swap",
  "Insufficient Balance",
  "Approve",
  "Insufficient liquidity for this trade",
  "Approving",
]);
const watchInputValue = async (v) => {
  inputLoading.value = true;
  inputStatus.value = 0;
  if (swapStore.inputValue) {
    swapStore.fromPrice =
      BigNumber(swapStore.fromTokenPrice)
        .times(swapStore.inputValue || 0)
        .toFixed(2) || 0;
  }
  await initQuotes(v);
  if (swapStore.inputValue && swapStore.inputValue !== '0') {
    setIntervalFn();
  } else {
    clearIntervalFn();
  }
  inputLoading.value = false;
};

const watchSlippage = () => {
  initQuotes();
};

watch(() => swapStore.inputValue, debounce(watchInputValue, 1000));
watch(() => swapStore.slippageNumerator, debounce(watchSlippage, 100));
watch(() => swapStore.slippageInput, debounce(watchSlippageInput, 100));

let version = 0;
const queryBalancesFn = async (tokenObj) => {
  version += 1;
  const myVersion = version;
  let tokens = tokenListMap[swapStore.allSourceChains.find((chain) => chain.chain_id == swapStore.sourceChainId)?.name].map((v) => {
    return {
      name: v.name,
      address: v.address,
      decimals: v.decimals,
    };
  });
  if (tokenObj) {
    tokens = [{ ...tokenObj }];
  }
  try {
    const { code, data } = await request2({
      method: "POST",
      url: "swap_auxiliary_api/v1/query_balances",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        user: swapAccount.value.address,
        chain_name: swapStore.allSourceChains.find(
          (chain) => chain.chain_id == swapStore.sourceChainId
        )?.name,
        tokens,
        version: version.toString(),
      },
    });
    if (code === 0) {
      // if (myVersion.toString() != data.version) return
      data.balances.map((item) => {
        const index = swapStore.balanceList.findIndex(
          (v) => (v.name === item.name)
        );
        if (index != -1) {
          swapStore.balanceList.splice(index, 1, item);
        } else {
          swapStore.balanceList.push(item);
        }
      });
    }
  } catch (error) {
    console.log("error", error);
  }
};
const initSearchToken = async (v) => {
  if (v.length === 42) {
    const params = {
      chain_name: userStore.allChains.find(
        (chain) => chain.chainid == swapStore.sourceChainId
      ).name,
      token: v,
    };
    if (swapAccount.value.address)
      params.user = swapAccount.value.address;
    const { code, data } = await request2({
      method: "GET",
      url: "swap_auxiliary_api/v1/query_token",
      params,
    });
    if (code !== 0) return;
    searchPopularTokens.value = data.map(item => {
      return {
        ...item,
        icon: item?.icon || getSwapImg("default.png"),
      };
    });

    //searchPopularTokens
    // if (!searchPopularTokens[swapStore.sourceChainId]) {
    //   searchPopularTokens[swapStore.sourceChainId] = [];
    // }
    // if (!searchBalanceList[swapStore.sourceChainId]) {
    //   searchBalanceList[swapStore.sourceChainId] = [];
    // }

    // data.map((v) => {
    //   const item = {
    //     ...v,
    //     usd_value: v.usd_value || "0",
    //     icon: v?.icon || getSwapImg("default.png"),
    //   };
    //   const balanceIndex = swapStore.balanceList.findIndex(
    //     (token) => token.name === item.name
    //   );
    //   if (balanceIndex !== -1) {
    //     swapStore.balanceList.splice(balanceIndex, 1, item);
    //     searchBalanceList[swapStore.sourceChainId].splice(
    //       balanceIndex,
    //       1,
    //       item
    //     );
    //   } else {
    //     swapStore.balanceList.push(item);
    //     searchBalanceList[swapStore.sourceChainId].push(item);
    //   }
    //   const popularIndex = popularTokens.value.findIndex(
    //     (token) => token.name === item.name
    //   );
    //   if (popularIndex !== -1) {
    //     popularTokens.value.splice(popularIndex, 1, item);
    //     searchPopularTokens[swapStore.sourceChainId].splice(
    //       popularIndex,
    //       1,
    //       item
    //     );
    //   } else {
    //     // popularTokens.value.push(item);
    //     searchPopularTokens[swapStore.sourceChainId].push(item);
    //     // insertIntoSortedArray(popularTokens.value, item);
    //     popularTokens.value.push(item);
    //   }
    // });
  }
};
watch(() => swapStore.inputSearchToken, debounce(initSearchToken, 5));

const insertIntoSortedArray = (arr, obj) => {
  const specialNames = ["USDC", "USDT", "ETH", "WETH", "WBTC"];
  let lastSpecialNameIndex = -1;

  for (let i = 0; i < arr.length; i++) {
    if (specialNames.includes(arr[i].name)) {
      lastSpecialNameIndex = i;
    }

    if (arr[i].address === obj.address) {
      arr[i] = obj;
      return;
    }
  }

  for (let i = lastSpecialNameIndex + 1; i < arr.length; i++) {
    const currentObj = arr[i];

    if (obj.usd_value === "0") {
      if (currentObj.usd_value === "0") {
        arr.splice(i, 0, obj);
        return;
      }
    } else {
      if (parseFloat(obj.usd_value) > parseFloat(currentObj.usd_value)) {
        arr.splice(i, 0, obj);
        return;
      }
    }
  }

  arr.push(obj);
};

const getMinimumReceivePrice = () => {
  const minus = BigNumber(swapStore.priceByToValue).minus(
    BigNumber(swapStore.fromPrice)
  );
  if (minus == "0") {
    return "0";
  } else {
    return minus
      .div(BigNumber(swapStore?.fromPrice || 0))
      .div(0.01)
      .toFixed(2);
  }
};

const initSourcesChains = async (chainId) => {
  try {
    const { code, data } = await request2({
      method: "GET",
      url: "/swap_auxiliary_api/v1/source_chains",
    });
    if (code !== 0) return;
    swapStore.allSourceChains = data;
    data.map((item) => {
      tokenListMap[item.name] = item.default_tokens.map((v) => {
        chaninTokenMap[`${v.name}-${v.address}`] = v;
        return {
          ...v,
          icon: v?.icon || getSwapImg("default.png"),
        };
      });
    });
  } catch (err) {
    console.log(err);
    swapStore.allSourceChains = [];
  } finally {
    // await initPopularTokens(chainId);
    const name = swapStore.allSourceChains.find((chain) => chain.chain_id == (chainId || swapStore.sourceChainId))?.name ||"EthereumMainnet";
    switchToken(swapStore.allSourceChains.find((chain) => chain.chain_id == (chainId || swapStore.sourceChainId)))
    popularTokens.value =
      tokenListMap[name]?.map((item) => {
        return {
          ...item,
          icon: item?.icon || getSwapImg("default.png"),
          usd_value: "0",
        };
      }) || [];
    initQuotes();
  }
};

const initPopularTokens = async () => {
  if (!swapAccount.value.status) return
  try {
    // tokenListLoading.value = true;
    const { code, data } = await request2({
      method: "GET",
      url: "/swap_auxiliary_api/v1/popular_tokens",
      params: {
        chain_name: swapStore.allSourceChains.find(
          (chain) => chain.chain_id == swapStore.sourceChainId
        )?.name,
        user: swapAccount.value.address,
      },
    });
    if (code !== 0) return;
    tokenListMap[swapStore.allSourceChains.find((chain) => chain.chain_id == swapStore.sourceChainId)?.name] = [...data.map(v=> {
      return {
        ...v,
        icon: v?.icon || getSwapImg("default.png"),
      }
    })];
  } catch (error) {
    console.log("error", error);
  } finally {
    // tokenListLoading.value = false;
  }
};

const carouselContainerFn = (item) => {
  tokenList.position = 'to';
  changeToken(item);
}
// const initPopularTokens = async (chainId, type) => {
//   try {
//     tokenListLoading.value = true;
//     const params = {
//       chain_name:
//         userStore.allChains.find((chain) => chain.chainid == (chainId || swapStore.sourceChainId))?.name ||
//         "ArbitrumOneMainnet",
//     };
//     if (userStore.owltoFinanceUserId)
//       params.user = userStore.owltoFinanceUserId;
//     const { code, data } = await request2({
//       method: "GET",
//       url: "/swap_auxiliary_api/v1/popular_tokens",
//       params,
//     });
//     if (code !== 0) return;
//     if (data.length < 2) {
//       // todo error
//     }
//     popularTokens.value =
//       data.map((item) => {
//         return {
//           ...item,
//           icon: item?.icon || getSwapImg("default.png"),
//           usd_value: "0",
//         };
//       }) || [];

//     if (searchPopularTokens[swapStore.sourceChainId]) {
//       searchPopularTokens[swapStore.sourceChainId].map((v) => {
//         insertIntoSortedArray(popularTokens.value, v);
//       });
//     }
//     if (searchBalanceList[swapStore.sourceChainId]) {
//       searchBalanceList[swapStore.sourceChainId].map((v) => {
//         swapStore.balanceList.push(v);
//       });
//     }
//     if (type === 'init') {
//       initBalance();
//       return
//     }

//     const pair = popularTokens.value.map((token) =>
//       token.name.toLocaleLowerCase()
//     );
//     if (!pair.includes(fromTokenValue.name))
//       toTokenValue.name = popularTokens.value.filter(
//         (token) => token.name !== swapStore.tokenOutName
//       )[0].name;

//     if (!pair.includes(swapStore.tokenOutName))
//       swapStore.tokenOutName = popularTokens.value.filter(
//         (token) => token.name !== swapStore.tokenInName
//       )[0].name;

//     initBalance();
//   } catch (err) {
//     console.log(err);
//   } finally {
//     tokenListLoading.value = false;
//   }
// };
</script>

<style lang="scss" scoped>
@import "./swap.scss";
</style>