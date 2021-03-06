
import { expect } from "chai";
import { Mohole } from "../../../src/cards/prelude/Mohole";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from '../../../src/Resources';

describe("Mohole", function () {
    it("Should play", function () {
        const card = new Mohole();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.HEAT)).to.eq(3);
        expect(player.heat).to.eq(3);
    });
});
