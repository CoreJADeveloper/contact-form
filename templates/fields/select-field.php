<?php
if ($field_object->required) {
    $required = 'required';
} else {
    $required = '';
}
if (!$field_object->hide_label && $field_object->required) {
    ?>
    <div>
        <label><?php echo esc_html($field_object->label) ?> <span class='required-field-class'>*</span></label>
    </div>
    <?php
} else if (!$field_object->hide_label && !$field_object->required) {
    ?>
    <div>
        <label><?php echo esc_html($field_object->label) ?></label>
    </div>
    <?php
} else {
    $field_html_label = '';
}

if ($field_object->hide_label && $field_object->required) {
    ?>
    <div>
        <span><span class='required-field-class'>*</span></span>
        <select
                class='<?php echo $field_object->classes ?>'
            <?php echo $required ?> name='ng-field[ng-field-<?php echo $array_key ?>]'>
            <?php
            foreach ($field_object->choices as $key => $choice) {
                if ($field_object->choice_selected == $key) {
                    $selected = 'selected';
                } else {
                    $selected = '';
                }

                ?>
                <option value='<?php echo $choice->text ?>' <?php echo $selected ?>>
                    <?php echo esc_html($choice->text) ?>
                </option>
                <?php
            }
            ?>
        </select>
        <div><span>
                <?php echo esc_html($field_object->description) ?>
            </span>
        </div>
    </div>
    <?php
} else {
    ?>
    <div class='<?php echo esc_html($field_object->built_classes) ?>'>
        <select
                class='<?php echo esc_attr($field_object->classes) ?>'
            <?php echo $required ?> name='ng-field[ng-field-<?php echo $array_key ?>]'>
            <?php
            foreach ($field_object->choices as $key => $choice) {
                if ($field_object->choice_selected == $key) {
                    $selected = 'selected';
                } else {
                    $selected = '';
                }

                ?>
                <option value='<?php echo $choice->text ?>' <?php echo $selected ?>>
                    <?php echo esc_html($choice->text) ?>
                </option>
                <?php
            }
            ?>
        </select>
        <div><span><?php echo esc_html($field_object->description) ?></span></div>
    </div>
    <?php
}