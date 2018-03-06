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

$field_html_input = '';

?>
    <div class='<?php echo esc_attr($field_object->built_classes) ?>'>
        <?php

        if ($field_object->hide_label && $field_object->required) {
            ?>
            <div>
                <span class='required-field-class'>*</span>
            </div>
            <?php
        }

        foreach ($field_object->choices as $key => $choice) {
            if ($field_object->choice_selected == $key) {
                $checked = 'checked';
            } else {
                $checked = '';
            }
            ?>
            <div>
                <label>
                    <input type='radio'
                           class='<?php echo esc_attr($field_object->classes) ?>'
                        <?php echo $checked ?>
                           value='<?php echo esc_html($choice->text) ?>'
                        <?php echo $required ?> name='ng-field[ng-field-<?php echo $array_key ?>]'/>
                    <?php echo esc_html($choice->text) ?>
                </label>
            </div>
            <?php
        }

        ?>
        <span><?php echo esc_html($field_object->description) ?></span>
    </div>