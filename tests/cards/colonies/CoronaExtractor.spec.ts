import { expect } from "chai";
import { CoronaExtractor } from "../../../src/cards/colonies/CoronaExtractor";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";

describe("CoronaExtractor", function () {
    it("Should play", function () {
        const card = new CoronaExtractor();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.ENERGY)).to.eq(4);
    });
});