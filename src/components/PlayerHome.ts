 
import Vue from "vue";

import { Board } from "./Board";
import { Card } from "./Card";
import { Milestone } from "./Milestone";
import { Award } from "./Award";
import { OtherPlayer } from "./OtherPlayer";
import { PlayerResources } from "./PlayerResources";
import { WaitingFor } from "./WaitingFor";
import { GlobalParameters } from "./GlobalParameters"
import { Preferences } from "./Preferences"
import { PlayerModel } from "../models/PlayerModel";
import { Colony } from './Colony';
import { LogPanel } from './LogPanel';
import { PlayerMixin } from './PlayerMixin';
import { TagCount } from './TagCount';


const dialogPolyfill = require("dialog-polyfill");

export const PlayerHome = Vue.component("player-home", {
    props: ["player"],
    components: {
        "board": Board,
        "card": Card,
        "other-player": OtherPlayer,
        "player-resources": PlayerResources,
        "waiting-for": WaitingFor,
        "global-parameters": GlobalParameters,
        "milestone": Milestone,
        "award": Award,
        "preferences": Preferences,
        "colony": Colony,
        "log-panel": LogPanel,
        "tag-count": TagCount
    },
    data: function () {
        return {}
    },
    mixins: [PlayerMixin],
    methods: {
        getPlayerCssForTurnOrder: (player: PlayerModel, hilightActive: boolean): string => {
            var ret: string = "player_color_" + player.color;
            if (hilightActive && player.isActive) ret += " player_is_active";
            return ret;
        },
        showPlayerDetails: function (player: PlayerModel) {
            if (player.id === this.player.id) return;
            
            (this.$root as any).setVisibilityState("other_player_" + player.id, true);
        }
    },
    mounted: function () {
        dialogPolyfill.default.registerDialog(document.getElementById("dialog-default"));
    },
    template: `
        <div id="player-home">
            <h1 :style="'color:' + player.color"><span v-i18n>Terraforming Mars</span> - {{player.name}}</h1>
            <section>
                <dialog class="nes-dialog" id="dialog-default">
                    <form method="dialog">
                        <p class="title" v-i18n>Error with input</p>
                        <p id="dialog-default-message"></p>
                        <menu class="dialog-menu">
                            <button class="btn btn-lg btn-primary">OK</button>
                        </menu>
                    </form>
                </dialog>
            </section>

            <div v-if="player.phase === 'end'">
                <div class="player_home_block">
                    <h2 v-i18n>This game is over!</h2>
                    <div v-for="otherPlayer in player.players">
                        <div :style="'color:' + otherPlayer.color">{{otherPlayer.name}} - {{otherPlayer.victoryPointsBreakdown.total}}</div>
                    </div>
                </div>
            </div>

            <preferences v-if="player.corporationCard" v-trim-whitespace></preferences>

            <div v-if="player.corporationCard">

                <div class="player_home_block">
                    <a name="board" class="player_home_anchor"></a>
                    <board :spaces="player.spaces" :venusNextExtension="player.venusNextExtension" :venusScaleLevel="player.venusScaleLevel" :boardName ="player.boardName"></board>

                    <global-parameters :oceans_count="player.oceans" :oxygen_level="player.oxygenLevel" :temperature="player.temperature" v-trim-whitespace></global-parameters>

                    <div v-if="player.players.length > 1" class="player_home_block--milestones-and-awards">
                        <milestone :milestones_list="player.milestones" />
                        <award :awards_list="player.awards" />
                    </div>
                </div>

                <div class="player_home_block player_home_block--turnorder nofloat" v-if="player.players.length>1">
                    <h3>Turn order <span class="help_tip">(click on player name to see details)</span></h3>
                    <div class="player_item" v-for="(p, idx) in player.players" v-trim-whitespace>
                        <div class="player_name_cont" :class="getPlayerCssForTurnOrder(p, false)">
                            <span class="player_number">{{ idx+1 }}.</span><a v-on:click.prevent="showPlayerDetails(p)" class="player_name" :class="getPlayerCssForTurnOrder(p, true)" href="#">{{ p.name }}</a>
                        </div>
                        <div class="player_separator" v-if="idx !== player.players.length - 1">⟶</div>
                    </div>
                    <div v-if="player.players.length > 1">
                        <div v-for="otherPlayer in player.players" :key="otherPlayer.id">
                            <other-player v-if="otherPlayer.id !== player.id" :player="otherPlayer"></other-player>
                        </div>
                    </div>
                </div>

                <div class="tag-display tags_item_cont tag-display-tags" v-if="player.tags.length > 0">
                    <div v-for="tag in player.tags">
                        <tag-count v-if="tag.count > 0" :tag="tag.tag" :count="tag.count"> </tag-count>
                    </div>
                </div>
                <div class="tag-display tags_item_cont" :class="player.tags.length > 0 ? 'tag-display-vp': ''">
                    <div>
                        <div class="tag-display">
                            <div class="tag-count icon-vp"></div>
                            <span class="tag-count-display"> : {{player.victoryPointsBreakdown.total}}</span>
                        </div>
                    </div>
                </div>

                <div class="player_home_block player_home_block--resources nofloat">
                    <player-resources :player="player" v-trim-whitespace></player-resources>
                </div>

                <div class="player_home_block player_home_block--actions nofloat">
                    <a name="actions" class="player_home_anchor"></a>
                    <h2 v-i18n>Actions</h2>
                    <waiting-for v-if="player.phase !== 'end'" :players="player.players" :player="player" :waitingfor="player.waitingFor"></waiting-for>
                </div>

                <div class="player_home_block player_home_block--log nofloat" v-if="player.players.length > 1 && player.gameLog.length > 0">
                    <h2 v-i18n>Last Actions</h2>
                    <log-panel :messages="player.gameLog" :players="player.players"></log-panel>
                </div>

                <a name="cards" class="player_home_anchor"></a>
                <div class="player_home_block player_home_block--hand" v-if="player.cardsInHand.length > 0">
                    <h2 v-i18n>Cards In Hand</h2>
                    <div v-for="card in player.cardsInHand" :key="card.name" class="cardbox">
                        <card :card="card.name" :resources="card.resources"></card>
                    </div>
                </div>

                <div class="player_home_block player_home_block--cards">
                    <h2 v-i18n>Played Cards</h2>

                    <div v-if="player.corporationCard !== undefined" class="cardbox">
                        <card :card="player.corporationCard" :resources="player.corporationCardResources"></card>
                    </div>
                    <div v-for="card in getCardsByType(player.playedCards, [getActiveCardType()])" :key="card.name" class="cardbox">
                        <card :card="card.name" :resources="card.resources" :player="player"></card>
                    </div>

                    <stacked-cards :cards="getCardsByType(player.playedCards, [getAutomatedCardType(), getPreludeCardType()])" ></stacked-cards>
                    <stacked-cards :cards="getCardsByType(player.playedCards, [getEventCardType()])" ></stacked-cards>
                </div>
            </div>

            <div class="player_home_block player_home_block--setup nofloat"  v-if="!player.corporationCard">
                <h2 v-i18n>Select initial cards:</h2>

                <waiting-for v-if="player.phase !== 'end'" :players="player.players" :player="player" :waitingfor="player.waitingFor"></waiting-for>

                <h2 v-i18n>Game details</h2>

                <details class="accordion" v-if="player.players.length > 1">
                    <summary class="accordion-header">
                        <div class="is-action">
                            <i class="icon icon-arrow-right mr-1"></i>
                            <span v-i18n>Milestones and awards</span>
                        </div>
                    </summary>
                    <div class="accordion-body">
                        <milestone :milestones_list="player.milestones" :expanded="true" />
                        <award :awards_list="player.awards" :expanded="true" />
                    </div>
                </details>

                <details class="accordion">
                    <summary class="accordion-header">
                        <div class="is-action">
                            <i class="icon icon-arrow-right mr-1"></i>
                            <span v-i18n>Board</span>
                        </div>
                    </summary>
                    <div class="accordion-body">
                        <board :spaces="player.spaces" :venusNextExtension="player.venusNextExtension" :venusScaleLevel="player.venusScaleLevel" :boardName ="player.boardName"></board>
                    </div>
                </details>
            </div>

            <div v-if="player.colonies.length > 0" class="player_home_block">
                <h2 v-i18n>Colonies</h2>
                <div class="player_home_colony_cont">
                    <div class="player_home_colony" v-for="colony in player.colonies" :key="colony.name">
                        <colony :colony="colony" :player="player"></colony>
                    </div>
                </div>
            </div>
        </div>
    `
});
