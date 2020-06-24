<template>
  <div class="elder__croppie" :style="background">
    <div class="elder__croppie-actions" v-if="value || instance">
      <template v-if="!instance">
        <button
          type="button"
          class="elder__croppie-button elder__croppie-button--error"
          @click="reset"
        >
          <fa icon="times"></fa>
        </button>
        <button
          type="button"
          class="elder__croppie-button"
          @click="$refs.file.click()"
        >
          <fa icon="pencil-alt"></fa>
        </button>
        <slot name="view-actions"></slot>
      </template>
      <template v-else>
        <template v-if="canRotate">
          <button
            type="button"
            class="elder__croppie-button"
            @click="rotate(90)"
          >
            <fa icon="undo"></fa>
          </button>
          <button
            type="button"
            class="elder__croppie-button"
            @click="rotate(-90)"
          >
            <fa icon="undo" flip="horizontal"></fa>
          </button>
        </template>
        <slot name="instance-actions"></slot>
      </template>
    </div>
    <div v-if="showPlaceholder" class="elder__croppie-placeholder">
      <button-component
        type="button"
        primary
        :label="placeholder"
        icon="plus"
        @click="$refs.file.click()"
      />
    </div>
    <div ref="croppie"></div>
    <input
      ref="file"
      type="file"
      accept="image/*"
      class="elder__croppie-upload"
      @change="prepare($event)"
    />
  </div>
</template>

<script>
import { Croppie } from "croppie";
import "croppie/croppie.css";
import "./icons";
import { ButtonComponent } from "vue-elder-button";
import { FontAwesomeIcon as Fa } from "@fortawesome/vue-fontawesome";

export default {
  props: {
    value: [String, File, Blob],
    placeholder: {
      type: String,
      default: "Last opp bilde",
    },
    options: Object,
  },
  data() {
    return {
      parsedValue: null,
      processing: false,
      instance: null,
    };
  },
  watch: {
    value: {
      handler() {
        this.parseValue();
      },
      immediate: true,
    },
  },
  computed: {
    background() {
      if (!this.parsedValue || this.instance) return null;
      return { backgroundImage: `url(${this.parsedValue})` };
    },
    showPlaceholder() {
      return !this.instance && !this.value;
    },
    canRotate() {
      return this.options && this.options.enableOrientation;
    },
  },
  methods: {
    parseValue() {
      if (!this.value || typeof this.value === "string")
        return (this.parsedValue = this.value);
      this.processing = true;

      let reader = new FileReader();
      reader.onload = () => {
        this.parsedValue = reader.result;
        this.processing = false;
      };
      reader.readAsDataURL(this.value);
    },
    reset() {
      this.$emit("input", null);
    },
    init(src) {
      this.processing = true;
      this.destroy();

      this.instance = new Croppie(this.$refs.croppie, this.options);

      this.instance
        .bind({
          url: src,
        })
        .then(() => (this.processing = false));

      this.$emit("ready", this.instance);
    },
    rotate(deg) {
      if (!this.instance) return;
      this.instance.rotate(deg);
    },
    prepare(e) {
      if (!e.target.files.length) return;

      let reader = new FileReader();
      reader.onload = () => {
        this.init(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    },
    destroy() {
      if (!this.instance) return;

      this.instance.destroy();
    },
  },
  components: {
    Fa,
    ButtonComponent,
  },
};
</script>

<style lang="scss">
$variables: (
  "primary": #3a9acd,
  "primary-contrast": white,
  "error": #e83b35,
  "error-contrast": white,
  "border-radius": 3px,
);

@function GetVariable($key) {
  @return var(--vue-elder-#{$key}, map-get($variables, $key));
}

.elder__croppie {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;

  background-color: GetVariable("croppie-background");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;

  &-actions {
    position: absolute;
    z-index: 2;
    right: 1em;
    bottom: 1em;

    display: flex;
  }

  &-button {
    $size: 30px;

    font: inherit;

    display: flex;
    align-items: center;
    justify-content: center;

    width: $size;
    height: $size;

    color: GetVariable("primary-contrast");
    border: none;
    border-radius: GetVariable("border-radius");
    outline: none;
    background-color: GetVariable("primary");

    &--error {
      color: GetVariable("error-contrast");
      background-color: GetVariable("error");
    }

    & + & {
      margin-left: 0.5em;
    }
  }

  &-upload {
    position: absolute;

    visibility: hidden;
  }

  &-placeholder {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    text-align: center;

    color: black;
  }

  .croppie-container {
    display: flex;
    flex-direction: column;

    .cr-boundary {
      flex-grow: 1;

      height: auto;
    }
  }
}
</style>
