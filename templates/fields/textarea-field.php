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
    <div class='<?php echo esc_attr($field_object->built_classes)?>'>
        <span class='required-field-class'>*</span>
        <textarea
                placeholder='<?php echo $field_object->placeholder ?>'
                class='<?php echo $field_object->built_classes ?> <?php echo $field_object->classes ?>'
                <?php echo $required ?> name='ng-field[ng-field-<?php echo $key ?>]'><?php echo esc_textarea($field_object->default_value) ?></textarea>
        <span><?php echo esc_html($field_object->description) ?></span>
    </div>
    <?php
} else {
    ?>
    <div class='<?php echo esc_attr($field_object->built_classes) ?>'>
        <textarea
                placeholder='<?php echo $field_object->placeholder ?>'
                class='<?php echo esc_attr($field_object->classes) ?>'
                <?php echo $required ?> name='ng-field[ng-field-<?php echo $key ?>]'><?php echo esc_textarea($field_object->default_value) ?></textarea>
        <span><?php echo esc_html($field_object->description) ?></span>
    </div>
    <?php
}